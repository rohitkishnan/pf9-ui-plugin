import React, { useContext } from 'react'
import useReactRouter from 'use-react-router'
import { withStyles } from '@material-ui/styles'
import {
  Button,
  Typography,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import ListItemText from '@material-ui/core/ListItemText'
import uuid from 'uuid'
import { propSatisfies, isNil, reject } from 'ramda'
import ApiClient from 'api-client/ApiClient'
import useParams from 'core/hooks/useParams'
import Progress from 'core/components/progress/Progress'
import TextField from 'core/components/validatedForm/TextField'
import Alert from 'core/components/Alert'
import ValidatedForm from 'core/components/validatedForm/ValidatedForm'
import { AppContext } from 'core/providers/AppProvider'
import { loginUrl } from 'app/constants.js'
import { useToast } from 'core/providers/ToastProvider'
import {
  hasOneSpecialChar,
  hasOneNumber,
  hasOneUpperChar,
  hasOneLowerChar,
  hasMinLength,
  requiredValidator,
  passwordValidator,
  matchFieldValidator,
} from 'core/utils/fieldValidators'

const styles = () => ({
  alertContainer: {
    width: '300px',
  },
})

const ChangePasswordPage = (props) => {
  const { params, updateParams } = useParams({
    loading: false,
    isError: false,
    newPassword: '',
    confirmPassword: '',
    isChangePasswordSuccessful: false,
    errorMessage: 'Change password failed',
  })

  const passwordValidatorList = [
    {
      displayText: 'At least 8 characters long',
      validator: hasMinLength(8),
    },
    {
      displayText: '1 Lowercase letter',
      validator: hasOneLowerChar,
    },
    {
      displayText: '1 Uppercase letter',
      validator: hasOneUpperChar,
    },
    {
      displayText: '1 Number',
      validator: hasOneNumber,
    },
    {
      displayText: '1 Special character - !@#$%^&*()?',
      validator: hasOneSpecialChar,
    },
  ]

  const { classes } = props
  const { history } = useReactRouter()
  const passwordValidators = [requiredValidator, passwordValidator]
  const confirmPasswordValidator = [
    passwordValidator,
    matchFieldValidator('newPassword').withMessage('Passwords do not match'),
  ]
  const {
    setContext,
    userDetails: { userId },
  } = useContext(AppContext)
  const showToast = useToast()
  const { keystone } = ApiClient.getInstance()

  const handleCancel = () => setContext({ isChangePassword: false })

  const handleFormSubmit = async (data) => {
    if (params.isChangePasswordSuccessful) {
      await setContext({ isChangePassword: false })
      history.push(loginUrl)
    }

    await updateParams({
      loading: true,
    })

    try {
      const body = { original_password: params.oldPassword, password: params.confirmPassword }
      const updateUserPromise = keystone.updateUserPassword(userId, body)
      await updateUserPromise.then((res) => (isNil(res) ? reject(isNil) : undefined))
      await updateParams({ isChangePasswordSuccessful: true, loading: false })
      await setContext({ isChangePassword: false })
      showToast('Successfully updated password. Please log in with new password.', 'success')
      history.push(loginUrl)
    } catch (err) {
      updateParams({ isError: true, loading: false })
    }
  }

  const updateValue = (key) => (value) => {
    updateParams({ [key]: value })
  }

  const CheckListItem = ({ children, checked }) => (
    <ListItem>
      <ListItemIcon>{checked ? <CheckIcon /> : <ClearIcon color="error" />}</ListItemIcon>
      <ListItemText primary={children} />
    </ListItem>
  )

  const renderPasswordValidationCheck = (values) => (
    <Typography variant="body1" component="div">
      Password must contain the following:
      <List dense>
        {passwordValidatorList.map((record) => (
          <CheckListItem
            key={uuid()}
            checked={propSatisfies(record.validator, 'newPassword', values)}
          >
            {record.displayText}
          </CheckListItem>
        ))}
      </List>
    </Typography>
  )

  return (
    <Dialog open fullWidth maxWidth="xs">
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Progress loading={params.loading} overlay renderContentOnMount message="Processing...">
          <Grid container justify="center">
            <Grid item>
              <ValidatedForm onSubmit={handleFormSubmit}>
                {({ values }) => (
                  <>
                    <TextField
                      variant="standard"
                      required
                      id="oldPassword"
                      className={classes.confirmPassword}
                      label="Old Password"
                      type="password"
                      onChange={updateValue('oldPassword')}
                    />
                    <TextField
                      variant="standard"
                      required
                      id="newPassword"
                      className={classes.confirmPassword}
                      label="New Password"
                      type="password"
                      validations={passwordValidators}
                      onChange={updateValue('newPassword')}
                    />
                    <TextField
                      variant="standard"
                      required
                      id="confirmPassword"
                      className={classes.confirmPassword}
                      label="Confirm Password"
                      type="password"
                      validations={confirmPasswordValidator}
                      onChange={updateValue('confirmPassword')}
                    />
                    {renderPasswordValidationCheck(values)}
                    {params.isError && (
                      <div className={classes.alertContainer}>
                        <Alert variant="error" message={params.errorMessage} />
                      </div>
                    )}
                    <Grid container spacing={4}>
                      <Grid item>
                        <Button variant="contained" color="secondary" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button type="submit" variant="contained" color="primary">
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
              </ValidatedForm>
            </Grid>
          </Grid>
        </Progress>
      </DialogContent>
    </Dialog>
  )
}

export default withStyles(styles)(ChangePasswordPage)
