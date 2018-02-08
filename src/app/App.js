import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router } from 'react-router-dom'
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
              TODO: Nav Menu
              <ul>
                {pluginManager.getNavItems().map(navItem => <li key={navItem.name}>{navItem.name}</li>)}
              </ul>
            </div>
            <div id="main-sidebar">
              TODO: Sidebar
            </div>
            <div id="main-content">
              TODO: Content
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
