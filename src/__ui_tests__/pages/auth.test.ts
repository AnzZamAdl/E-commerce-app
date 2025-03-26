import { By } from 'selenium-webdriver';
import { BASE_URL, waitForElement } from '../utils/test-utils';

describe('Authentication', () => {
  describe('Login', () => {
    beforeEach(async () => {
      await driver.get(`${BASE_URL}/login`);
    });

    it('shows validation errors for invalid input', async () => {
      const submitButton = await waitForElement(driver, 'button[type="submit"]');
      await submitButton.click();

      const errors = await driver.findElements(By.css('.text-red-600'));
      expect(errors.length).toBeGreaterThan(0);
    });

    it('successfully logs in with valid credentials', async () => {
      const emailInput = await waitForElement(driver, 'input[type="email"]');
      const passwordInput = await waitForElement(driver, 'input[type="password"]');
      const submitButton = await waitForElement(driver, 'button[type="submit"]');

      await emailInput.sendKeys('test@example.com');
      await passwordInput.sendKeys('password123');
      await submitButton.click();

      // Verify successful login by checking for user email in header
      const userEmail = await waitForElement(driver, '.text-sm.text-gray-700');
      expect(await userEmail.getText()).toContain('test@example.com');
    });
  });

  describe('Registration', () => {
    beforeEach(async () => {
      await driver.get(`${BASE_URL}/register`);
    });

    it('validates password confirmation', async () => {
      const emailInput = await waitForElement(driver, 'input[type="email"]');
      const passwordInput = await waitForElement(driver, 'input[name="password"]');
      const confirmPasswordInput = await waitForElement(driver, 'input[name="confirmPassword"]');
      const submitButton = await waitForElement(driver, 'button[type="submit"]');

      await emailInput.sendKeys('newuser@example.com');
      await passwordInput.sendKeys('password123');
      await confirmPasswordInput.sendKeys('different');
      await submitButton.click();

      const error = await waitForElement(driver, '.text-red-600');
      expect(await error.getText()).toContain('Passwords do not match');
    });

    it('successfully registers new user', async () => {
      const emailInput = await waitForElement(driver, 'input[type="email"]');
      const passwordInput = await waitForElement(driver, 'input[name="password"]');
      const confirmPasswordInput = await waitForElement(driver, 'input[name="confirmPassword"]');
      const submitButton = await waitForElement(driver, 'button[type="submit"]');

      await emailInput.sendKeys('newuser@example.com');
      await passwordInput.sendKeys('password123');
      await confirmPasswordInput.sendKeys('password123');
      await submitButton.click();

      // Verify redirect to login page
      await driver.wait(until.urlContains('/login'), 5000);
    });
  });
});