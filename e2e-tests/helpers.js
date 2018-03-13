import { By, until } from 'selenium-webdriver'
import { driver } from './setup'

export const DEFAULT_TIMEOUT = 2000

export const untilClass = (className, timeout = DEFAULT_TIMEOUT) =>
  driver.wait(until.elementLocated(By.className(className)), timeout)

export const elementByClass = className => driver.findElement(By.className(className))

export const setTextField = async (element, text) => {
  await element.clear()
  await element.sendKeys(text)
}
