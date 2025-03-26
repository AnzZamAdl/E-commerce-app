import { WebDriver, until, By } from 'selenium-webdriver';

export const BASE_URL = 'http://localhost:5173';

export async function waitForElement(driver: WebDriver, selector: string, timeout = 10000) {
  const element = await driver.wait(until.elementLocated(By.css(selector)), timeout);
  return await driver.wait(until.elementIsVisible(element), timeout);
}

export async function login(driver: WebDriver, email: string, password: string) {
  await driver.get(`${BASE_URL}/login`);
  
  await (await waitForElement(driver, 'input[type="email"]')).sendKeys(email);
  await (await waitForElement(driver, 'input[type="password"]')).sendKeys(password);
  await (await waitForElement(driver, 'button[type="submit"]')).click();
  
  // Wait for navigation
  await driver.wait(until.urlIs(`${BASE_URL}/`), 5000);
}