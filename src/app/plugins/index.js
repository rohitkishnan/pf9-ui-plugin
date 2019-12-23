import openstack from './openstack'
// import kubernetes from './kubernetes'
import developer from './developer'
import theme from './theme'
import Cre from './cre'

const devEnabled = window.localStorage.enableDevPlugin === 'true'

const plugins = [
  // Order here is important as it will define the default Dashboard route
  // for fallback routes (when trying to reach the base url)
  Cre,
  // kubernetes,
  openstack,
  theme,
  ...(devEnabled ? [developer] : []),
]

export default plugins
