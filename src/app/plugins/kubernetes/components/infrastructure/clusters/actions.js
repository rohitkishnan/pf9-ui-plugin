import createCRUDActions from 'core/helpers/createCRUDActions'
import { mapAsync } from 'utils/async'
import { pluck, pathOr, pipe, either, propSatisfies, compose, path, propEq } from 'ramda'
import calcUsageTotals from 'k8s/util/calcUsageTotals'
import { castFuzzyBool } from 'utils/misc'
import { filterIf, isTruthy, updateWith } from 'utils/fp'
import {
  clustersCacheKey, combinedHostsCacheKey, loadCombinedHosts,
} from 'k8s/components/infrastructure/common/actions'
import ApiClient from 'api-client/ApiClient'
import { allKey } from 'app/constants'
import { rawNodesCacheKey } from 'k8s/components/infrastructure/nodes/actions'

const { qbert } = ApiClient.getInstance()

const getProgressPercent = async clusterId => {
  try {
    const { progressPercent } = await qbert.getClusterDetails(clusterId)
    return progressPercent
  } catch (e) {
    console.warn(e)
    return null
  }
}
const getKubernetesVersion = async clusterId => {
  try {
    const version = await qbert.getKubernetesVersion(clusterId)
    return version && version.gitVersion && version.gitVersion.substr(1)
  } catch (e) {
    console.warn(e)
    return null
  }
}

export const hasMasterNode = propSatisfies(isTruthy, 'hasMasterNode')
export const masterlessCluster = propSatisfies(isTruthy, 'masterless')
export const hasPrometheusEnabled = compose(castFuzzyBool, path(['tags', 'pf9-system:monitoring']))
export const hasAppCatalogEnabled = propSatisfies(isTruthy, 'appCatalogEnabled')

export const clusterActions = createCRUDActions(clustersCacheKey, {
  createFn: (params) => qbert.createCluster(params),
  listFn: async (params, loadFromContext) => {
    const [rawNodes, combinedHosts, rawClusters, qbertEndpoint] = await Promise.all([
      loadFromContext(rawNodesCacheKey),
      loadFromContext(combinedHostsCacheKey),
      qbert.getClusters(),
      qbert.baseUrl(),
    ])
    return mapAsync(async cluster => {
      const nodesInCluster = rawNodes.filter(node => node.clusterUuid === cluster.uuid)
      const nodeIds = pluck('uuid', nodesInCluster)
      const combinedNodes = combinedHosts.filter(x => nodeIds.includes(x.resmgr.id))
      const calcNodesTotals = calcUsageTotals(combinedNodes)
      const usage = {
        compute: calcNodesTotals('usage.compute.current', 'usage.compute.max'),
        memory: calcNodesTotals('usage.memory.current', 'usage.memory.max'),
        disk: calcNodesTotals('usage.disk.current', 'usage.disk.max'),
      }
      const masterNodes = nodesInCluster.filter(node => node.isMaster === 1)
      const healthyMasterNodes = masterNodes.filter(
        node => node.status === 'ok' && node.api_responding === 1)
      const hasMasterNode = healthyMasterNodes.length > 0
      const clusterOk = nodesInCluster.length > 0 && cluster.status === 'ok'
      const dashboardLink = `${qbertEndpoint}/clusters/${cluster.uuid}/k8sapi/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:443/proxy/`
      const host = qbertEndpoint.match(/(.*?)\/qbert/)[1]
      const fuzzyBools = ['allowWorkloadsOnMaster', 'privileged', 'appCatalogEnabled'].reduce(
        (accum, key) => {
          accum[key] = castFuzzyBool(cluster[key])
          return accum
        },
        {},
      )
      const progressPercent = cluster.taskStatus === 'converging'
        ? await getProgressPercent(cluster.uuid)
        : null
      const version = hasMasterNode
        ? await getKubernetesVersion(cluster.uuid)
        : null

      return {
        ...cluster,
        usage,
        version: version || 'N/A',
        nodes: nodesInCluster,
        masterNodes,
        progressPercent,
        healthyMasterNodes,
        hasMasterNode,
        highlyAvailable: healthyMasterNodes.length > 2,
        links: {
          dashboard: clusterOk ? dashboardLink : null,
          // Rendering happens in <DownloadKubeConfigLink />
          kubeconfig: clusterOk ? { cluster } : null,
          // Rendering happens in <ClusterCLI />
          cli: clusterOk ? { host, cluster } : null,
        },
        ...fuzzyBools,
        hasVpn: castFuzzyBool(pathOr(false, ['cloudProperties', 'internalElb'], cluster)),
        hasLoadBalancer: castFuzzyBool(cluster.enableMetallb || pathOr(false, ['cloudProperties', 'enableLbaas'], cluster)),
      }
    }, rawClusters)
  },
  deleteFn: async ({ id }) => {
    await qbert.deleteCluster(id)
    // Refresh clusters since combinedHosts will still
    // have references to the deleted cluster.
    loadCombinedHosts.invalidateCache()
  },
  customOperations: {
    scaleCluster: async ({ cluster, numSpotWorkers, numWorkers, spotPrice }, prevItems) => {
      const body = {
        numWorkers,
        numSpotWorkers: numSpotWorkers || 0,
        spotPrice: spotPrice || 0.001,
        spotWorkerFlavor: cluster.cloudProperties.workerFlavor,
      }
      await qbert.updateCluster(cluster.uuid, body)

      // Update the cluster in the cache
      return updateWith(propEq('uuid', cluster.uuid), {
        ...cluster,
        numWorkers,
      }, prevItems)
    },
  },
  uniqueIdentifier: 'uuid',
  dataMapper: (items,
    { masterNodeClusters, masterlessClusters, hasControlPanel, appCatalogClusters, prometheusClusters }) => pipe(
    filterIf(masterNodeClusters, hasMasterNode),
    filterIf(masterlessClusters, masterlessCluster),
    filterIf(prometheusClusters, hasPrometheusEnabled),
    filterIf(appCatalogClusters, hasAppCatalogEnabled),
    filterIf(hasControlPanel, either(hasMasterNode, masterlessCluster)),
  )(items),
  defaultOrderBy: 'name',
})

// If params.clusterId is not assigned it fetches all clusters and extracts the clusterId from the first cluster
// It also adds a "clusters" param that contains all the clusters, just for convenience
export const parseClusterParams = async (params, loadFromContext) => {
  const clusters = await loadFromContext(clustersCacheKey, params)
  const { clusterId = pathOr(allKey, [0, 'uuid'], clusters) } = params
  return [clusterId, clusters]
}