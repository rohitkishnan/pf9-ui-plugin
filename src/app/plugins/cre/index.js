import React from 'react'
import AccountIndexPage from './components/account/AccountIndexPage'
import InventoryPage from './components/inventory/InventoryPage'
import DashboardPage from './components/dashboard/DashboardPage'
import RiskProfilePage from './components/riskProfile/RiskProfilePage'
import AddAccountPage from './components/account/AddAccountPage'
import ModifyAccountPage from './components/account/ModifyAccountPage'
import RecommendationIndexPage from './components/recommendation/RecommendationIndexPage'
import ExecuteRecommendationIndexPage from './components/recommendation/ExecuteRecommendationIndexPage'

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
      name: 'Recommendation',
      link: { path: '/recommendation', exact: true },
      component: RecommendationIndexPage
    },
    {
      name: 'Recommendation',
      link: { path: '/recommendation/execute/:id', exact: true },
      component: ExecuteRecommendationIndexPage
    },
  ])

  const devNavItems = [
    { name: 'Dashboard', link: { path: '/dashboard' }, icon: 'tachometer' },
    { name: 'Account', link: { path: '/account' },  icon: 'user', },
    { name: 'Inventory', link: { path: '/inventory' }, icon: 'inventory' },
    { name: 'Recommendation', link: { path: '/recommendation' }, icon: 'thumbs-up' },
    { name: 'Risk Profile', link: { path: '/riskProfile' }, icon: 'exclamation-triangle' }
  ]
  const allNavItems = [...devNavItems]
  plugin.registerNavItems(allNavItems)
}

export default Cre
