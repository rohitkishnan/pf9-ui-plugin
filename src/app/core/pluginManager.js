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

  registerPage (page) {
    data.pages.push(page)
  },

  registerNavItem (item) {
    data.navItems.push(item)
  },

  getPages () {
    return data.pages
  },

  getNavItems () {
    return data.navItems
  },
}

export default pluginManager
