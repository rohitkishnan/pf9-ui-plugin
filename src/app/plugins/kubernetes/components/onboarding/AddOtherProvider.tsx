import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme, Typography } from '@material-ui/core'
import BulletList from 'core/components/BulletList'
import Alert from 'core/components/Alert'
import SubmitButton from 'core/components/buttons/SubmitButton'
import { SupportedPlatforms } from './OnboardingPage'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  requirements: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    margin: theme.spacing(4)
  },
  alertTitle: {
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(2)
  },
  text: {
    marginTop: theme.spacing(1)
  }
}))

const nodeServices = ['Prometheus', 'Fluentd', 'Kubeadm']

const AddOtherProvider = ({onComplete}) => {
  const classes = useStyles({})
  const handleClick = useCallback( () => {
    onComplete({type: SupportedPlatforms.Other})
  }, [onComplete])
  return (
    <div className={classes.root}>
      <Typography className={classes.text}>All you need is a single VM or physical server.</Typography>
      <Typography className={classes.text}>Deploy a single node master + worker with:</Typography>
      <BulletList items={nodeServices} />

      <Alert variant="info">
        <Typography className={classes.alertTitle} variant="subtitle2">Minimum Hardware Requirements:</Typography>
        <div className={classes.requirements}>
          <span>4 CPUs</span>
          <span>8GB RAM</span>
          <span>30GB HDD</span>
          <span>1 NIC</span>
        </div>
      </Alert>
      <SubmitButton onClick={handleClick}>Deploy With Bare OS</SubmitButton>
    </div>
  )
}
export default AddOtherProvider