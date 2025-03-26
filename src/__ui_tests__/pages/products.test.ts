import { By, until } from 'selenium-webdriver';
import { BASE_URL, waitForElement } from '../utils/test-utils';

describe('Products Page', () => {
  beforeEach(async () => {
    await driver.get(`${BASE_URL}/products`);
  });

  it('displays products grid', async () => {
    const products = await driver.findElements(By.css('.grid > a'));
    expect(products.length).toBeGreaterThan(0);
  });

  it('navigates to product details when clicking a product', async () => {
    const firstProduct = await waitForElement(driver, '.grid > a');
    const productTitle = await firstProduct.getText();
    await firstProduct.click();

    // Wait for navigation and verify product title is displayed
    const detailsTitle = await waitForElement(driver, 'h1');
    expect(await detailsTitle.getText()).toBe(productTitle);
  });

  it('displays loading state', async () => {
    await driver.navigate().refresh();
    const loader = await waitForElement(driver, '.animate-spin');
    expect(await loader.isDisplayed()).toBe(true);
  });
});