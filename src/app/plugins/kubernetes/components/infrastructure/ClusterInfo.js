import React from 'react'
import InfoPanel from 'core/components/InfoPanel'
import UsageWidget from 'core/components/dashboardGraphs/UsageWidget'
import clusterUsageStats from './clusterUsageStats'
import { Grid } from '@material-ui/core'
import { compose } from 'ramda'
import { loadClusters } from './actions'
import { withAppContext } from 'core/AppContext'
import { withDataLoader } from 'core/DataLoader'
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/styles'

const overviewStats = cluster => ({
  'Status':              cluster.status,
  'CloudProvider':       cluster.cloudProviderName,
  'Cloud Provider Type': cluster.cloudProviderType,
  'Kubernetes Version':  cluster.version || 'unavailable',
  'Containers CIDR':     cluster.containersCidr,
  'Services CIDR':       cluster.servicesCidr,
  'Privileged':          cluster.privileged,
  'Unique ID':           cluster.uuid,
})

const openstackProps = cluster => ({
  'Load Balancer': cluster.hasLoadBalancer,
  'Physical Network Interface': cluster.masterVipIface,
  'Virtual IP Address': cluster.masterVipIpv4,
  'MetalLB CIDR': cluster.metallbCidr,
})

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit
  },
})

const ClusterInfo = ({ match, data, context, classes }) => {
  const cluster = data.find(x => x.uuid === match.params.id)
  const { usage } = clusterUsageStats(cluster, context)
  return (
    <React.Fragment>
      <Grid container spacing={40} className={classes.root}>
        <Grid item xs={4}>
          <UsageWidget title="Compute" stats={usage.compute} />
        </Grid>
        <Grid item xs={4}>
          <UsageWidget title="Memory" stats={usage.memory} />
        </Grid>
        <Grid item xs={4}>
          <UsageWidget title="Storage" stats={usage.disk} />
        </Grid>
      </Grid>
      <Grid container spacing={40} className={classes.root}>
        <Grid item xs={6}>
          <InfoPanel title="Overview" items={overviewStats(cluster)} />
        </Grid>
        <Grid item xs={6}>
          <InfoPanel title="OpenStack Properties" items={openstackProps(cluster)} />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default compose(
  withStyles(styles),
  withRouter,
  withAppContext,
  withDataLoader(loadClusters),
)(ClusterInfo)
