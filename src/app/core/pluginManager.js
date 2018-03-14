const defaultOptions = {
  showFooter: false,
  showNavMenu: false,
  showSidebar: false,
}

let data = {
  pluginList: [],
  routes: [],
  navItems: [],
  options: { ...defaultOptions },
}

const pluginManager = {
  clearAll () {
    data.pluginList = []
    data.routes = []
    data.navItems = []
    data.options = { ...defaultOptions }
  },

  registerRoutes (...components) {
    components.forEach(component => data.routes.push(component))
  },

  registerNavItems (...items) {
    items.forEach(item => {
      data.navItems.push(item)
    })
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
