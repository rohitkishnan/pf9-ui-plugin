let data = {
  pluginList: [],
  routes: [],
  navItems: [],
}

const pluginManager = {
  clearAll () {
    data.pluginList = []
    data.routes = []
    data.navItems = []
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
}

export default pluginManager
