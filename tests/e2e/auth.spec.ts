import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('h1, h2')).toContainText('Masuk');
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Email')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'admin@attendance.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('text=Daftar sekarang');
    
    await expect(page).toHaveURL(/.*register/);
  });
});
