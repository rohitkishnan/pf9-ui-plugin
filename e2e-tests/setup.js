const webdriver = require('selenium-webdriver')

const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build()

driver.navigate().to('https://pf9.platform9.net')
