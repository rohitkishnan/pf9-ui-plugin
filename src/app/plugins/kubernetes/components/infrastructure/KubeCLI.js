import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'ramda'
import { withAppContext } from 'core/AppContext'
import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import SimpleLink from 'core/common/SimpleLink'

const styles = {
  appBar: {
    position: 'relative'
  },
  flex: {
    flex: 1,
  },
  iframe: {
    width: '95%',
    height: '95%',
  }
}

const Transition = props => <Slide direction="up" {...props} />

class KubeCLI extends React.Component {
  state = { url: null, open: false }

  handleClick = async () => {
    const { host, cluster, context } = this.props
    const token = await context.apiClient.qbert.getCliToken(cluster.uuid)
    const url = `${host}/container/index.html?token=${token}`
    this.setState({ url, open: true })
  }

  handleClose = e => {
    // Need to stop the bubbling so the row does not get selected in the table
    e.preventDefault()
    e.stopPropagation()
    this.setState({ open: false })
  }

  render () {
    const { classes } = this.props
    return (
      <div>
        <SimpleLink onClick={this.handleClick}>CLI</SimpleLink>
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>KubeCLI</Typography>
            </Toolbar>
          </AppBar>
          <iframe className={classes.iframe} src={this.state.url} />
        </Dialog>
      </div>
    )
  }
}

KubeCLI.propTypes = {
  host: PropTypes.string.isRequired,
  cluster: PropTypes.object.isRequired,
}

export default compose(
  withAppContext,
  withStyles(styles),
)(KubeCLI)