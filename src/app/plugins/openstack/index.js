import React from 'react'
import { combineReducers } from 'redux'

import DashboardPage from './components/DashboardPage'
import LoginPage from './components/LoginPage'
import TenantsPage from './components/TenantsPage'

import UsersPage from './components/UsersPage'
import AddUsersPage from './components/users/AddUsersPage'

import loginReducer from './reducers/login'
import sessionReducer from './reducers/session'
import tenantsReducer from './reducers/tenants'
import usersReducer from './reducers/users'

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
    {
      name: 'Users',
      link: { path: '/users', exact: true },
      component: UsersPage
    },
    {
      name: 'Users',
      link: { path: '/users/add' },
      component: AddUsersPage
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
    {
      name: 'Users',
      link: { path: '/users' }
    },
  )
}

OpenStack.reducer = combineReducers({
  login: loginReducer,
  session: sessionReducer,
  tenants: tenantsReducer,
  users: usersReducer,
})

export default OpenStack
