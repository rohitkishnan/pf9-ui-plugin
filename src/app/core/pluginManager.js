let data = {
  pluginList: [],
  pages: [],
  navItems: [],
}

const pluginManager = {
  clearPlugins () {
    data.pluginList = []
    data.pages = []
    data.navItems = []
  },

  registerRoute (Component) {
    data.pages.push(Component)
  },

  registerRoutes (...components) {
    components.forEach(component => data.pages.push(component))
  },

  registerNavItem (item) {
    data.navItems.push(item)
  },

  registerNavItems (...items) {
    items.forEach(item => {
      data.navItems.push(item)
    })
  },

  getPages () {
    return data.pages
  },

  getNavItems () {
    return data.navItems
  },
}

export default pluginManager
