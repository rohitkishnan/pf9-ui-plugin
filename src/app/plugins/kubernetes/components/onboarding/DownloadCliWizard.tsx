// Libs
import React, { useMemo, /*useEffect, useState*/ } from 'react'
import { makeStyles, Theme, Typography } from '@material-ui/core'

// Hooks
import useParams from 'core/hooks/useParams'
import useInterval from 'core/hooks/useInterval'

// Components
import FormWrapper from 'core/components/FormWrapper'
import Wizard from 'core/components/wizard/Wizard'
import WizardStep from 'core/components/wizard/WizardStep'
import BulletList from 'core/components/BulletList'
import Code from 'core/components/CodeBlock'
import useDataLoader from 'core/hooks/useDataLoader'
import { loadCombinedHosts } from '../infrastructure/common/actions'

const initialContext = {

}

const useStyles = makeStyles<any, {spacing?: number}>((theme: Theme) => ({
  detailSection: {
    marginTop: ({spacing}) => theme.spacing(spacing)
  },
  detailTitle: {
    marginBottom: theme.spacing(1)
  },
  indentText: {
    marginLeft: theme.spacing(4),
  },
  flex: {
    display: 'flex',
    alignItems: 'center'
  }
}))

const DownloadCliWizard = () => {
  const classes = useStyles({})
  const [hosts, loading, reloadHosts] = useDataLoader(loadCombinedHosts)
  const {params} = useParams()

  const handleSubmit = parameters => async data => {
    console.log(parameters, data)
    // TODO there is no real form submit.
    // After the cli is finished running there will be a newly created node.
    // Update this to redirect to dashboard on completion
  }

  const handlePollForCombinedHosts = useInterval( () => {
    reloadHosts()
  }, 2000)


  const wzStepOneListItems = useMemo(
    () => [
      'Open the Terminal App',
      <div className={classes.flex}>
        <Typography>Type</Typography>
        <Code>
          <span>curl -# -o ftp://ftp.example.com/file.zip</span>
        </Code>
      </div>,
    ],
    [],
  )

  return (
    <FormWrapper title="BareOS Deployment" loading={false}>
      <Wizard onComplete={handleSubmit(params)} context={initialContext}>
        {({ wizardContext, setWizardContext, onNext }) => {
          return (
            <>
              <WizardStep stepId="install" label="Install Cli">
                <>
                  <WizardStepDetails title={`Install & Run the Installation Wizard`} spacing={1}>
                    <BulletList items={wzStepOneListItems} />
                    <Typography className={classes.indentText}>You’ll see messages in the Terminal explaining what you need to do to complete the installation process.</Typography>
                  </WizardStepDetails>
                  <WizardStepDetails title="Monitor Deployment" spacing={5}>
                    <Typography>Once you have installed the wizard, you will be able to monitor the deployment on the next page.</Typography>
                  </WizardStepDetails>
                </>
              </WizardStep>

              <WizardStep stepId="monitor" label="Monitor Deployment">
                <div>TODO: figure out where to pull data.</div>
              </WizardStep>
            </>
          )
        }}
      </Wizard>
    </FormWrapper>
  )
}

export default DownloadCliWizard

const WizardStepDetails = ({title, children, spacing = 1}) => {
  const classes = useStyles({spacing})
  return (
    <div className={classes.detailSection}>
      <Typography variant="subtitle2" className={classes.detailTitle}>{title}</Typography>
      {children}
    </div>
  )
}