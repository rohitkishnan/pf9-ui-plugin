const defaultOptions = {
  showFooter: false,
  showNavMenu: true,
  showSidebar: false,
}

let data = {
  components: [],
  pluginList: [],
  routes: [],
  navItems: [],
  options: { ...defaultOptions },
}

const pluginManager = {
  clearAll () {
    data.components = []
    data.pluginList = []
    data.routes = []
    data.navItems = []
    data.options = { ...defaultOptions }
  },

  registerComponent (component) {
    data.components.push(component)
  },

  registerRoutes (...components) {
    components.forEach(component => data.routes.push(component))
  },

  registerNavItems (...items) {
    items.forEach(item => {
      data.navItems.push(item)
    })
  },

  getComponents () {
    return data.components
  },

  getRoutes () {
    return data.routes
  },

  getNavItems () {
    return data.navItems
  },

  getOptions () {
    return data.options
  },

  getOption (key) {
    return data.options[key]
  },

  setOption (key, value) {
    data.options[key] = value
  },
}

export default pluginManager
