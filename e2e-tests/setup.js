const config = require('../config')
const webdriver = require('selenium-webdriver')

const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build()

const { host } = config
driver.navigate().to(host)
