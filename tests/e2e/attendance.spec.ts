import { test, expect } from '@playwright/test';

test.describe('Attendance', () => {
  test.beforeEach(async ({ page }) => {
    // Login as teacher
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'guru1@sman1jakarta.sch.id');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/);
  });

  test('should navigate to attendance page', async ({ page }) => {
    await page.click('text=Absensi');
    await expect(page).toHaveURL(/.*attendance/);
  });

  test('should display QR code tab', async ({ page }) => {
    await page.goto('/dashboard/attendance');
    await expect(page.locator('text=QR Code')).toBeVisible();
  });

  test('should display manual attendance tab', async ({ page }) => {
    await page.goto('/dashboard/attendance');
    await page.click('text=Manual');
    await expect(page.locator('text=Input Absensi Manual')).toBeVisible();
  });

  test('should display attendance history', async ({ page }) => {
    await page.goto('/dashboard/attendance');
    await page.click('text=Riwayat');
    await expect(page.locator('text=Riwayat Absensi')).toBeVisible();
  });
});
