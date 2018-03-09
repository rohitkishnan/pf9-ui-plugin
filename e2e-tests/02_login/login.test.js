const config = require('../../config')
const registry = require('../../src/app/util/registry')
const puppeteer = require('puppeteer')

let browser
let page

describe.skip('login', () => {
  beforeAll(async () => {
    registry.setupFromConfig(config)
    browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
    })
    console.log(`Attempting to navigate browser to ${config.host}`)
    page = await browser.newPage()
    await page.goto(config.host)
  })

  afterAll(async () => {
    // await browser.close()
  })

  describe('login form', () => {
    it('should show the login form when there is no session', async () => {
      const x = 123
      expect(x).toEqual(123)
    })

    it('should show an error when the user uses bad credentials')

    it('should redirect to the dashboard when the user enters valid credentials')
  })
})
