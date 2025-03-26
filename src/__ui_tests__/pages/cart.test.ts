import { By } from 'selenium-webdriver';
import { BASE_URL, waitForElement, login } from '../utils/test-utils';

describe('Cart Page', () => {
  beforeEach(async () => {
    await driver.get(`${BASE_URL}/cart`);
  });

  it('shows empty cart message for guest users', async () => {
    const emptyMessage = await waitForElement(driver, '.text-center');
    expect(await emptyMessage.getText()).toContain('Your cart is empty');
  });

  describe('Authenticated User', () => {
    beforeAll(async () => {
      await login(driver, 'test@example.com', 'password123');
    });

    it('displays cart items for logged in user', async () => {
      // First add an item to cart
      await driver.get(`${BASE_URL}/products`);
      const firstProduct = await waitForElement(driver, '.grid > a');
      await firstProduct.click();
      
      const addToCartButton = await waitForElement(driver, 'button:contains("Add to Cart")');
      await addToCartButton.click();

      // Navigate to cart and verify item is there
      await driver.get(`${BASE_URL}/cart`);
      const cartItems = await driver.findElements(By.css('.space-y-8 > div'));
      expect(cartItems.length).toBeGreaterThan(0);
    });

    it('updates quantity when clicking plus/minus buttons', async () => {
      const plusButton = await waitForElement(driver, 'button:has(.lucide-plus)');
      const quantityElement = await waitForElement(driver, '.quantity');
      const initialQuantity = await quantityElement.getText();

      await plusButton.click();
      await driver.sleep(1000); // Wait for update

      const updatedQuantity = await quantityElement.getText();
      expect(Number(updatedQuantity)).toBe(Number(initialQuantity) + 1);
    });

    it('removes item from cart', async () => {
      const removeButton = await waitForElement(driver, 'button:has(.lucide-trash-2)');
      await removeButton.click();

      const emptyMessage = await waitForElement(driver, '.text-center');
      expect(await emptyMessage.getText()).toContain('Your cart is empty');
    });
  });
});