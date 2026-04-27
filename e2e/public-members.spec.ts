import { test, expect } from '@playwright/test';

test.describe('Public members (team) listing', () => {
  test('renders team page with heading', async ({ page }) => {
    await page.goto('/members');
    await expect(page.getByRole('heading', { name: /our team/i })).toBeVisible();
  });

  test('shows filter sidebar', async ({ page }) => {
    await page.goto('/members');
    await expect(page.locator('aside')).toBeVisible();
  });

  test('empty state when no results match filter', async ({ page }) => {
    await page.goto('/members?search=zzznomatches99999');
    await expect(
      page.getByText(/no members found/i),
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Member detail page', () => {
  test('navigates from listing to detail', async ({ page }) => {
    await page.goto('/members');
    const firstLink = page.locator('a[href^="/members/"]').first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await expect(page).toHaveURL(/\/members\/.+/);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('404 for unknown member id', async ({ page }) => {
    const res = await page.goto('/members/000000000000000000000000');
    const bodyText = await page.textContent('body');
    const is404 = res?.status() === 404 || /not found/i.test(bodyText ?? '');
    expect(is404).toBeTruthy();
  });
});
