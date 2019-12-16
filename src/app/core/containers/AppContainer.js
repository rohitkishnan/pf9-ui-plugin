import React, { useEffect, useContext } from 'react'
import ApiClient from 'api-client/ApiClient'
import { AppContext } from 'core/providers/AppProvider'
import { usePreferences, useScopedPreferences } from 'core/providers/PreferencesProvider'
import { setStorage, getStorage } from 'core/utils/pf9Storage'
import { loadUserTenants } from 'openstack/components/tenants/actions'
import { head, path, pathOr, propEq, isEmpty, isNil } from 'ramda'
import AuthenticatedContainer from 'core/containers/AuthenticatedContainer'
import track from 'utils/tracking'
import useReactRouter from 'use-react-router'
import { makeStyles } from '@material-ui/styles'
import { Route, Redirect, Switch } from 'react-router'
import {
  dashboardUrl, resetPasswordUrl, resetPasswordThroughEmailUrl, forgotPasswordUrl, loginUrl,
} from 'app/constants'
import ResetPasswordPage from 'core/public/ResetPasswordPage'
import ForgotPasswordPage from 'core/public/ForgotPasswordPage'
import { isNilOrEmpty } from 'utils/fp'
import LoginPage from 'core/public/LoginPage'
import Progress from 'core/components/progress/Progress'
import { getCookieValue } from 'utils/misc'
import moment from 'moment'
import { useToast } from 'core/providers/ToastProvider'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
}))

/**
 * Sets up the Openstack session.
 * Renders children when logged in.
 * Otherwise shows the <LoginPage>
 */
const AppContainer = () => {
  const classes = useStyles()
  const { keystone, setActiveRegion } = ApiClient.getInstance()
  const { history } = useReactRouter()
  const showToast = useToast()
  const [, initUserPreferences] = usePreferences()
  const { updatePrefs } = useScopedPreferences('Tenants')
  const { initialized, initSession, session, appLoaded, destroySession, getContext, setContext } = useContext(AppContext)

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      track('pageLoad', { route: `${location.pathname}${location.hash}` })
    })

    // This is to send page event for the first page the user lands on
    track('pageLoad', { route: `${history.location.pathname}${history.location.hash}` })

    restoreSession()

    return unlisten
  }, [])

  useEffect(() => {
    if (!isEmpty(session)) {
      const id = setInterval(() => {
        // Check if session has expired
        const { expiresAt } = session
        const sessionExpired = moment().isAfter(expiresAt)
        if (sessionExpired) {
          destroySession()
          showToast('The session has expired, please log in again', 'warning')
          clearInterval(id)
        }
      }, 1000)
      // Reset the interval if the session changes
      return () => clearInterval(id)
    }
  }, [session])

  const restoreSession = async () => {
    // When trying to login with cookie with pmkft
    if (history.location.pathname === '/ui/pmkft/login') {
      const scopedToken = getCookieValue('X-Auth-Token')

      // Start from scratch to make use of prebuilt functions
      // for standard login page
      const { unscopedToken, username } = await keystone.getUnscopedTokenWithToken(scopedToken)
      if (!unscopedToken) {
        history.push(loginUrl)
        return
      }
      await setupSession({ username, unscopedToken })
      history.push(dashboardUrl)
      return
    }
    // Attempt to restore the session
    const tokens = getStorage('tokens')
    const user = getStorage('user') || {}
    const { name: username } = user
    const currUnscopedToken = tokens && tokens.unscopedToken
    if (username && currUnscopedToken) {
      // We need to make sure the token has not expired.
      const response = await keystone.renewToken(currUnscopedToken)

      if (isNil(response)) {
        return history.push(loginUrl)
      }

      const { unscopedToken, expiresAt, issuedAt } = response

      if (unscopedToken && user) {
        return setupSession({ username, unscopedToken, expiresAt, issuedAt })
      }
    }
    await setContext({ appLoaded: true })

    if (history.location.pathname === forgotPasswordUrl) return history.push(forgotPasswordUrl)

    // TODO: Need to fix this code after synching up with backend.
    if (history.location.hash.includes(resetPasswordThroughEmailUrl)) return history.push(history.location.hash.slice().replace('#', '/ui'))

    history.push(loginUrl)
  }

  // Handler that gets invoked on successful authentication
  const setupSession = async ({ username, unscopedToken, expiresAt, issuedAt }) => {
    await setContext({
      appLoaded: true,
      initialized: false,
    })

    const timeDiff = moment(expiresAt).diff(issuedAt)
    const localExpiresAt = moment().add(timeDiff).format()

    // Set up the scopedToken
    await initSession(unscopedToken, username, localExpiresAt)
    // The order matters, we need the session to be able to init the user preferences
    const userPreferences = await initUserPreferences(username)

    const lastTenant = pathOr('service', ['Tenants', 'lastTenant', 'name'], userPreferences)
    const lastRegion = path(['RegionChooser', 'lastRegion', 'id'], userPreferences)

    const tenants = await loadUserTenants({ getContext, setContext })
    const activeTenant = tenants.find(propEq('name', lastTenant)) || head(tenants)

    if (lastRegion) { setActiveRegion(lastRegion) }
    const { scopedToken, user, role } = await keystone.changeProjectScope(activeTenant.id)
    await keystone.resetCookie()

    /* eslint-disable */
    // Identify the user in Segment using Keystone ID
    if (typeof analytics !== 'undefined') {
      analytics.identify(user.id, {
        email: user.name,
      })
    }

    /* eslint-enable */
    updatePrefs({ lastTenant: activeTenant })
    setStorage('userTenants', tenants)
    setStorage('user', user)
    setStorage('tokens', { unscopedToken, currentToken: scopedToken })

    await setContext({
      initialized: true,
      currentTenant: activeTenant,
      userDetails: { ...user, role },
    })
  }

  const loadingMessage = appLoaded
    ? 'Initializing session...'
    : 'Loading app...'

  const authContent = isNilOrEmpty(session)
    ? <Redirect to={loginUrl} />
    : <AuthenticatedContainer />

  // Do not let the rest of the UI load until we have a working session.
  return <div className={classes.root} id="_main-container">
    <Switch>
      <Route path={resetPasswordUrl} component={ResetPasswordPage} />
      <Route path={forgotPasswordUrl} component={ForgotPasswordPage} />
      <Route path={loginUrl}>
        <LoginPage onAuthSuccess={setupSession} />
      </Route>
      <Route>
        {appLoaded && initialized
          ? authContent
          : <Progress renderLoadingImage={false} loading message={loadingMessage} />}
      </Route>
    </Switch>
  </div>
}

export default AppContainer
