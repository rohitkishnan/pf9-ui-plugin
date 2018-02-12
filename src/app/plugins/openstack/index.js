import React from 'react'
import LoginPage from './components/LoginPage'
import TenantsPage from './components/TenantsPage'

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
  </div>
)

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
      component: Dashboard
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
