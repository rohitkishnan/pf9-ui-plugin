import React from 'react'

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
  pluginManager.registerPage({
    name: 'Dashboard',
    link: { url: '/', exactMatch: true },
    component: Dashboard
  })

  pluginManager.registerNavItem({
    name: 'Dashboard',
    link: { url: '/', exactMatch: true }
  })
}

export default OpenStack
