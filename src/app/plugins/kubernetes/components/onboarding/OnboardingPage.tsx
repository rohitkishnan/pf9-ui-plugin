// Libs
import React, { useState, useCallback, useMemo } from 'react'
import { makeStyles, Theme } from '@material-ui/core'
import useReactRouter from 'use-react-router'

// Hooks
import useDataUpdater from 'core/hooks/useDataUpdater'

// Actions
import { cloudProviderActions } from '../infrastructure/cloudProviders/actions'

// Utils
import { capitalizeString } from 'utils/misc'
import { objSwitchCase } from 'utils/fp'
// Little silly but the JS type inference from peeking at objSwitchCase
// wasn't matching the actual function signiture
type IActiveForm = ({ onComplete }: { onComplete: (values: any) => void }) => JSX.Element
type IObjSwitchCase<T> = (
  casesObj: { [key: string]: T },
  defaultValue: string,
) => (input: string) => T
const switchCase: IObjSwitchCase<IActiveForm> = objSwitchCase

// Components
import ChoosePlatform from './ChoosePlatform'
import AddAwsCloudProvider from '../infrastructure/cloudProviders/AddAwsCloudProvider'
import AddAzureCloudProvider from '../infrastructure/cloudProviders/AddAzureCloudProvider'
import AddOtherProvider from './AddOtherProvider'
import DownloadCliWizard from './DownloadCliWizard'
import FormWrapper from 'core/components/FormWrapper'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
    maxWidth: '800px',
  },
}))

export enum SupportedPlatforms {
  Other = 'other',
  Aws = 'aws',
  Azure = 'azure',
  Openstack = 'openstack',
  Vmware = 'vmware',
}

const promptViews = {
  [SupportedPlatforms.Other]: AddOtherProvider,
  [SupportedPlatforms.Aws]: AddAwsCloudProvider,
  [SupportedPlatforms.Azure]: AddAzureCloudProvider,
}

const AddProviderPage = props => {
  const { FormComponent } = props
  const { history } = useReactRouter()
  const platformType = capitalizeString(props.type)

  const onComplete = useCallback(
    (data) => {
      // TODO look into prefilling the add cluster context with the newly created data
      history.push(`/ui/kubernetes/infrastructure/clusters/add${platformType}`)
    },
    [history],
  )

  const [handleAdd, loading] = useDataUpdater(cloudProviderActions.create, onComplete)
  return (
    <FormWrapper title={''}>
      <FormComponent {...props} loading={loading} onComplete={handleAdd} />
    </FormWrapper>
  )
}

const OnboardingPage = () => {
  const classes = useStyles({})
  const [activePlatform, setActivePlatform] = useState<SupportedPlatforms>(SupportedPlatforms.Other)
  const [activeView, setActiveView] = useState<null | 'other'>(null)

  const handleClick = useCallback((type: SupportedPlatforms) => {
    setActivePlatform(type)
  }, [])

  const handleComplete = useCallback((type = null) => {
    setActiveView(type)
  }, [])

  const ActiveForm = useMemo(() => switchCase(promptViews, activePlatform)(activePlatform), [
    activePlatform,
  ])

  const isOtherFlow = activeView === SupportedPlatforms.Other

  return (
    <div className={classes.root}>
      {activeView === null && (
        <>
          <ChoosePlatform onClick={handleClick} activePlatform={activePlatform} />
          { activePlatform === SupportedPlatforms.Other 
            ? <ActiveForm onComplete={handleComplete} />
            : <AddProviderPage FormComponent={ActiveForm} type={activePlatform} /> 
          }
        </>
      )}
      {isOtherFlow && <DownloadCliWizard /> }
    </div>
  )
}

export default OnboardingPage
