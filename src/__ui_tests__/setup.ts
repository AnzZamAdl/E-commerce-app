import { Builder, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

declare global {
  var driver: WebDriver;
}

beforeAll(async () => {
  const options = new Options()
    .addArguments('--headless')
    .addArguments('--no-sandbox')
    .addArguments('--disable-dev-shm-usage');

  global.driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
});

afterAll(async () => {
  await global.driver?.quit();
});