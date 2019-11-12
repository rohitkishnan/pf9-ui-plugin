// Libs
import React, { useState, useCallback, useMemo } from 'react'
import { makeStyles, Theme } from '@material-ui/core'

// Utils
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

const OnboardingPage = () => {
  const classes = useStyles({})
  const [activePlatform, setActivePlatform] = useState<SupportedPlatforms>(SupportedPlatforms.Other)
  const [activeView, setActiveView] = useState<null | 'other'>(null)
  const handleClick = useCallback(
    (type: SupportedPlatforms) => {
      setActivePlatform(type)
    },
    [activePlatform],
  )

  const handleComplete = formData => {
    switch (formData.type) {
      case SupportedPlatforms.Other:
        setActiveView(SupportedPlatforms.Other)
        break
      case SupportedPlatforms.Aws:
        // TODO call action to create provider, then redirect to create cluster flow for aws
        console.log(SupportedPlatforms.Aws)
        break
      case SupportedPlatforms.Azure:
        // TODO call action to create provider, then redirect to create cluster flow for azure
        console.log(SupportedPlatforms.Azure)
        break
      default:
        break
    }
  }
  const ActiveForm = useMemo(() => switchCase(promptViews, activePlatform)(activePlatform), [
    activePlatform,
  ])

  return (
    <div className={classes.root}>
      {activeView === null && (
        <>
          <ChoosePlatform onClick={handleClick} activePlatform={activePlatform} />
          <ActiveForm onComplete={handleComplete} />
        </>
      )}
      {activeView === SupportedPlatforms.Other && <DownloadCliWizard /> }
    </div>
  )
}

export default OnboardingPage
