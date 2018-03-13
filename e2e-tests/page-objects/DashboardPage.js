import { navigateTo } from '../setup'
import {
  untilClass,
} from '../helpers'

class DashboardPage {
  async goto () {
    await navigateTo('/')
    this.dashboardPageElement = await untilClass('dashboard-page')
  }

  async isPresent () {
    try {
      await untilClass('dashboard-page')
      return true
    } catch (err) {
      return false
    }
  }
}

export default DashboardPage
