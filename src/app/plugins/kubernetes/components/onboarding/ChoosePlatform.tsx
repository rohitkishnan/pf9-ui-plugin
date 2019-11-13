import React from 'react'
import { makeStyles } from '@material-ui/styles'
import CloudProviderCard from '../common/CloudProviderCard'
import { Theme } from '@material-ui/core'
import FormWrapper from 'core/components/FormWrapper'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
  },
}))

const ChoosePlatform = ({onClick, activePlatform}) => {
  const classes = useStyles({})
  return (
    <FormWrapper className={classes.root} title="Select a platform to get started.">
      <CloudProviderCard active={activePlatform === 'other'} type="other" onClick={onClick} />
      <CloudProviderCard active={activePlatform === 'aws'} type="aws" onClick={onClick} />
      <CloudProviderCard active={activePlatform === 'azure'} type="azure" onClick={onClick} />
    </FormWrapper>
  )
}
export default ChoosePlatform