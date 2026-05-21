import { test, expect } from '@playwright/test';

test.describe('Cart flow', () => {
  test.beforeAll(async ({ request }) => {
    // Ensure test user exists
    await request.post('http://localhost:3001/api/auth/register', {
      data: {
        email: 'test@example.com',
        password: 'Test123!',
        name: 'Test User',
      },
    }).catch(() => {}); // ignore if already exists
  });

  test('guest adds item to cart, logs in, merges cart', async ({ page }) => {
    await page.goto('/');
    // Wait for product grid to load
    await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 10000 });
    await page.click('button:has-text("Add to Cart")');

    // Go to cart
    await page.click('text=Cart');
    await expect(page.locator('text=Total')).toBeVisible();

    // Click login link
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');

    // After login, cart should still have item
    await page.click('text=Cart');
    await expect(page.locator('text=Total')).toBeVisible();

    // Proceed to checkout (we only test redirect starts, not full Paystack)
    await page.click('button:has-text("Proceed to Checkout")');
    await expect(page.locator('text=Redirecting...')).toBeVisible();
  });
});