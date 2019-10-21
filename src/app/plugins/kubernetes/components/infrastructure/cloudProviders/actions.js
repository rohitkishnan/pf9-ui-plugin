import createContextLoader from 'core/helpers/createContextLoader'
import createCRUDActions from 'core/helpers/createCRUDActions'
import { pluck, propSatisfies, propEq } from 'ramda'
import { capitalizeString } from 'utils/misc'
import calcUsageTotals from 'k8s/util/calcUsageTotals'
import { pathStrOr } from 'utils/fp'
import {
  clustersCacheKey, combinedHostsCacheKey,
} from 'k8s/components/infrastructure/common/actions'
import ApiClient from 'api-client/ApiClient'

const { qbert } = ApiClient.getInstance()

const cloudProviderTypes = {
  aws: 'Amazon AWS Provider',
  azure: 'Microsoft Azure Provider',
  openstack: 'OpenStack',
}

export const cloudProvidersCacheKey = 'cloudProviders'

export const cloudProviderActions = createCRUDActions(cloudProvidersCacheKey, {
  listFn: () => qbert.getCloudProviders(),
  createFn: (params) => qbert.createCloudProvider(params),
  updateFn: ({ id, ...data }) => qbert.updateCloudProvider(id, data),
  deleteFn: ({ id }) => qbert.deleteCloudProvider(id),
  customOperations: {
    attachNodesToCluster: async ({ clusterUuid, nodes }, currentItems) => {
      const nodeUuids = pluck('uuid', nodes)
      await qbert.attach(clusterUuid, nodes)
      // Assign nodes to their clusters in the context as well so the user
      // can't add the same node to another cluster.
      return currentItems.map(node =>
        nodeUuids.includes(node.uuid) ? ({ ...node, clusterUuid }) : node)
    },
    detachNodesFromCluster: async ({ clusterUuid, nodeUuids }, currentItems) => {
      await qbert.detach(clusterUuid, nodeUuids)
      return currentItems.map(node =>
        nodeUuids.includes(node.uuid) ? ({ ...node, clusterUuid: null }) : node)
    },
  },
  refetchCascade: true,
  dataMapper: async (items, params, loadFromContext) => {
    const [clusters, combinedHosts] = await Promise.all([
      loadFromContext(clustersCacheKey),
      loadFromContext(combinedHostsCacheKey),
    ])
    const getNodesHosts = nodeIds =>
      combinedHosts.filter(propSatisfies(id => nodeIds.includes(id), 'id'))
    const usagePathStr = 'resmgr.extensions.resource_usage.data'

    return items.map(cloudProvider => {
      const descriptiveType = cloudProviderTypes[cloudProvider.type] || capitalizeString(cloudProvider.type)
      const filterCpClusters = propEq('nodePoolUuid', cloudProvider.nodePoolUuid)
      const cpClusters = clusters.filter(filterCpClusters)
      const cpNodes = pluck('nodes', cpClusters).flat()
      const cpHosts = getNodesHosts(pluck('uuid', cpNodes))
      const calcDeployedCapacity = calcUsageTotals(cpHosts)
      const deployedCapacity = {
        compute: calcDeployedCapacity(`${usagePathStr}.cpu.used`, `${usagePathStr}.cpu.total`),
        memory: calcDeployedCapacity(
          item => pathStrOr(0, `${usagePathStr}.memory.total`, item) - pathStrOr(0, `${usagePathStr}.memory.available`, item),
          `${usagePathStr}.memory.total`, true),
        disk: calcDeployedCapacity(`${usagePathStr}.disk.used`, `${usagePathStr}.disk.total`),
      }

      return {
        ...cloudProvider,
        descriptiveType,
        deployedCapacity,
        clusters: cpClusters,
        nodes: cpNodes,
      }
    })
  },
  uniqueIdentifier: 'uuid',
})

export const loadCloudProviderDetails = createContextLoader(
  'cloudProviderDetails',
  async ({ cloudProviderId }) => {
    const response = await qbert.getCloudProviderDetails(cloudProviderId)
    return response.Regions
  },
  {
    uniqueIdentifier: 'RegionName',
    indexBy: 'cloudProviderId',
  },
)

export const loadCloudProviderRegionDetails = createContextLoader(
  'cloudProviderRegionDetails',
  async ({ cloudProviderId, cloudProviderRegionId }) => {
    const response = await qbert.getCloudProviderRegionDetails(cloudProviderId, cloudProviderRegionId)
    // We create an artificial `id` parameter in the response so that createContextLoader has a
    // uniqueIdentifier to key off of.  Failure to do this results in inproperly cached values.
    return { id: `${cloudProviderId}-${cloudProviderRegionId}`, ...response }
  },
  {
    indexBy: ['cloudProviderId', 'cloudProviderRegionId'],
  },
)
