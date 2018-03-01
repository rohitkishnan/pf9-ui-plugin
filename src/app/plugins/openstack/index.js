import React from 'react'
import LoginPage from './components/LoginPage'
import TenantsPage from './components/TenantsPage'
import DashboardPage from './components/DashboardPage'

class OpenStack extends React.Component {
  render () {
    return (
      <h1>OpenStack Plugin</h1>
    )
  }
}

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

export default OpenStack
