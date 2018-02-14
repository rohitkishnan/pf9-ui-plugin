import React from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

import './app.css'

class App extends React.Component {
  render () {
    const theme = createMuiTheme({
      palette: {
        type: this.props.theme
      }
    })

    const { pluginManager } = this.context

    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <div id="main-container">
            <div id="nav-menu">
              <ul>
                {pluginManager.getNavItems().map(navItem => <li key={navItem.name}><Link to={navItem.link.path}>{navItem.name}</Link></li>)}
              </ul>
            </div>
            <div id="main-sidebar">
              TODO: Sidebar
            </div>
            <div id="main-content">
              <Switch>
                {pluginManager.getRoutes().map(route => {
                  const { component, link } = route
                  const Component = component
                  return <Route key={route.name} path={link.path} exact={link.exact || false} component={Component} />
                })}
              </Switch>
            </div>
            <div id="main-footer">
              TODO: Footer
            </div>
          </div>
        </MuiThemeProvider>
      </Router>
    )
  }
}

App.contextTypes = {
  pluginManager: PropTypes.object
}

export default App
