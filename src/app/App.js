import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

const App = () => (
  <div>
    <h1>Testing</h1>
  </div>
)
/*
class App extends React.Component {
  render () {
    const theme = createMuiTheme({
      palette: {
        type: this.props.theme
      }
    })

    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <div>
            <h1>Hello World!</h1>
          </div>
        </MuiThemeProvider>
      </Router>
    )
  }
}
*/

export default App
