import React from 'react'
import DownloadKubeConfigLink from './DownloadKubeConfigLink'
import KubeCLI from './KubeCLI'
import SimpleLink from 'core/components/SimpleLink'
import clusterUsageStats from './clusterUsageStats'
import UsageBar from 'core/components/dashboardGraphs/UsageBar'
import {
  AddToQueue as AttachIcon,
  RemoveFromQueue as DetachIcon,
  TrendingUp as ScaleIcon,
  PresentToAll as UpgradeIcon,
} from '@material-ui/icons'
import { deleteCluster, loadInfrastructure } from './actions'
import createCRUDComponents from 'core/helpers/createCRUDComponents'

const renderLinks = links => {
  if (!links) { return null }
  return (
    <div>
      {links.dashboard && <SimpleLink src={links.dashboard} target="_blank">Dashboard</SimpleLink>}
      {links.kubeconfig && <DownloadKubeConfigLink cluster={links.kubeconfig.cluster} />}
      {links.cli && <KubeCLI {...links.cli} />}
    </div>
  )
}

const renderStats = (_, cluster, context) => {
  const { usage } = clusterUsageStats(cluster, context)
  const hasValidStats = usage && usage.compute && usage.compute.current
  if (!hasValidStats) { return null }
  return (
    <div>
      <div>Compute: <UsageBar stats={usage.compute} /></div>
      <div>Memory: <UsageBar stats={usage.memory} /></div>
      <div>Storage: <UsageBar stats={usage.disk} /></div>
    </div>
  )
}

const renderClusterDetailLink = (name, cluster) => <SimpleLink src={`/ui/kubernetes/infrastructure/clusters/${cluster.uuid}`}>{name}</SimpleLink>

const canAttachNode = (selected, context) => true
const canDetachNode = (selected, context) => true
const canScaleCluster = (selected, context) => true
const canUpgradeCluster = (selected, context) => true

const attachNode = (selected, context) => {
  console.log('TODO: attachNode')
}

const detachNode = (selected, context) => {
  console.log('TODO: detachNode')
}

const scaleCluster = (selected, context) => {
  console.log('TODO: scaleCluster')
}

const upgradeCluster = (selected, context) => {
  console.log('TODO: upgradeCluster')
}

export const options = {
  baseUrl: '/ui/kubernetes/infrastructure/clusters',
  columns: [
    { id: 'name', label: 'Cluster name', render: renderClusterDetailLink },
    { id: 'status', label: 'Status' },
    { id: 'links', label: 'Links', render: renderLinks },
    { id: 'cloudProviderType', label: 'Deployment Type' },
    { id: 'resource_utilization', label: 'Resource Utilization', render: renderStats },
    { id: 'version', label: 'Kubernetes version' },
    { id: 'networkPlugin', label: 'Network Backend' },
    { id: 'containersCidr', label: 'Containers CIDR' },
    { id: 'servicesCidr', label: 'Services CIDR' },
    { id: 'endpoint', label: 'API endpoint' },
    { id: 'cloudProviderName', label: 'Cloud provider' },
    { id: 'allowWorkloadsOnMaster', label: 'Master Workloads' },
    { id: 'privileged', label: 'Privileged' },
    { id: 'hasVpn', label: 'VPN' },
    { id: 'appCatalogEnabled', label: 'App Catalog', render: x => x ? 'Enabled' : 'Not Enabled' },
    { id: 'hasLoadBalancer', label: 'Load Balancer' },

    // TODO: We probably want to write a metadata renderer for this kind of format
    // since we use it in a few places for tags / metadata.
    { id: 'tags', label: 'Metadata', render: data => JSON.stringify(data) }
  ],
  dataKey: 'clusters',
  loaderFn: loadInfrastructure,
  deleteFn: deleteCluster,
  name: 'Clusters',
  title: 'Clusters',
  uniqueIdentifier: 'uuid',
  rowActions: [
    { cond: canAttachNode, icon: <AttachIcon />, label: 'Attach node', action: attachNode },
    { cond: canDetachNode, icon: <DetachIcon />, label: 'Detach node', action: detachNode },
    { cond: canScaleCluster, icon: <ScaleIcon />, label: 'Scale cluster', action: scaleCluster },
    { cond: canUpgradeCluster, icon: <UpgradeIcon />, label: 'Upgrade cluster', action: upgradeCluster },
  ],
}

const { ListPage, List } = createCRUDComponents(options)
export const NodesList = List

export default ListPage
