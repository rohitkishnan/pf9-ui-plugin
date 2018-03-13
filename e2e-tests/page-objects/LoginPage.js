import { navigateTo } from '../setup'
import {
  elementByClass,
  setTextField,
  untilClass,
} from '../helpers'

class LoginPage {
  async goto () {
    await navigateTo('/')
    this.loginPageElement = await untilClass('login-page')
  }

  async fillCredentials (username, password) {
    const usernameField = await elementByClass('login-username')
    const passwordField = await elementByClass('login-password')

    await setTextField(usernameField, username)
    await setTextField(passwordField, password)
  }

  async submit () {
    await elementByClass('login-submit').click()
  }

  async login (username, password) {
    await this.fillCredentials(username, password)
    await this.submit()
  }

  async getStatus (showProgress = false) {
    // Normally we don't care about seeing the intermediate "Attempting login..."
    if (showProgress) {
      return elementByClass('login-status').getText()
    }
    const status = await untilClass('login-result')
    return status.getText()
  }

  async isPresent () {
    try {
      await untilClass('login-page')
      return true
    } catch (err) {
      return false
    }
  }
}

export default LoginPage
