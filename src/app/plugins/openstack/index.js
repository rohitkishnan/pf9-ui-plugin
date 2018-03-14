import React from 'react'
import { combineReducers } from 'redux'

import LoginPage from './components/LoginPage'
import TenantsPage from './components/TenantsPage'
import DashboardPage from './components/DashboardPage'

import loginReducer from './reducers/login'
import sessionReducer from './reducers/session'

class OpenStack extends React.Component {
  render () {
    return (
      <h1>OpenStack Plugin</h1>
    )
  }
}

OpenStack.__name__ = 'openstack'

OpenStack.registerPlugin = pluginManager => {
  pluginManager.registerRoutes(
    {
      name: 'Dashboard',
      link: { path: '/', exact: true },
      component: DashboardPage
    },
    {
      name: 'Login',
      link: { path: '/login' },
      component: LoginPage
    },
    {
      name: 'Tenants',
      link: { path: '/tenants' },
      component: TenantsPage
    },
  )

  pluginManager.registerNavItems(
    {
      name: 'Dashboard',
      link: { path: '/' }
    },
    {
      name: 'Tenants',
      link: { path: '/tenants' }
    },
  )
}

OpenStack.reducer = combineReducers({
  login: loginReducer,
  session: sessionReducer,
})

export default OpenStack
