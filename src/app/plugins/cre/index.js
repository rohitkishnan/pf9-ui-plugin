import React from 'react'
import AccountIndexPage from './components/account/AccountIndexPage'
import InventoryPage from './components/inventory/InventoryPage'
import DashboardPage from './components/dashboard/DashboardPage'
import RiskProfilePage from './components/riskProfile/RiskProfilePage'
import AddAccountPage from './components/account/AddAccountPage'
import ModifyAccountPage from './components/account/ModifyAccountPage'
import RecommendationIndexPage from './components/recommendation/RecommendationIndexPage'

class Cre extends React.PureComponent {
  render () {
    return (
      <h1>CRE Plugin</h1>
    )
  }
}

Cre.__name__ = 'cre'

Cre.registerPlugin = pluginManager => {
  const plugin = pluginManager.registerPlugin('cre', 'Cre', '/ui/cre')

  plugin.registerRoutes([
    {
      name: 'Account',
      link: { path: '/account', exact: true },
      component: AccountIndexPage
    },
    {
      name: 'Inventory',
      link: { path: '/inventory', exact: true },
      component: InventoryPage
    },
    {
      name: 'Risk Profile',
      link: { path: '/riskProfile', exact: true },
      component: RiskProfilePage
    },
    {
      name: 'Dashboard',
      link: { path: '/dashboard', exact: true },
      component: DashboardPage
    },
    {
      name: 'Add Account',
      link: { path: '/account/add', exact: true },
      component: AddAccountPage
    },
    {
      name: 'Modify Account',
      link: { path: '/account/edit/:id', exact: true },
      component: ModifyAccountPage
    },
    {
      name: 'Recommendation Index',
      link: { path: '/recommendation', exact: true },
      component: RecommendationIndexPage
    }
  ])

  const devNavItems = [
    { name: 'Dashboard', link: { path: '/dashboard' } },
    { name: 'Account', link: { path: '/account' } },
    { name: 'Inventory', link: { path: '/inventory' } },
    { name: 'Recommendation', link: { path: '/recommendation' } },
    { name: 'Risk Profile', link: { path: '/riskProfile' } }
  ]

  const allNavItems = [...devNavItems]
  plugin.registerNavItems(allNavItems)
}

export default Cre
