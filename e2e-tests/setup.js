const config = require('../config')
const webdriver = require('selenium-webdriver')

export const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build()

const { devHost } = config
driver.navigate().to(devHost)

export const navigateTo = url => driver.navigate().to(`${devHost}${url}`)
