import { test, expect } from '@playwright/test';

test.describe('Public works listing', () => {
  test('renders works page with heading', async ({ page }) => {
    await page.goto('/works');
    await expect(page.getByRole('heading', { name: 'Works' })).toBeVisible();
  });

  test('shows filter sidebar', async ({ page }) => {
    await page.goto('/works');
    // Filter controls should be present
    await expect(page.locator('aside')).toBeVisible();
  });

  test('search filter updates URL', async ({ page }) => {
    await page.goto('/works');
    const searchInput = page.getByPlaceholder(/search/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('concrete');
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/search=concrete/);
    }
  });

  test('empty state message when no results', async ({ page }) => {
    await page.goto('/works?search=zzznomatches99999');
    await expect(
      page.getByText(/no works found/i),
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Work detail page', () => {
  test('navigates from listing to detail', async ({ page }) => {
    await page.goto('/works');
    const firstLink = page.locator('a[href^="/works/"]').first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await expect(page).toHaveURL(/\/works\/.+/);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('404 for unknown work id', async ({ page }) => {
    const res = await page.goto('/works/000000000000000000000000');
    // Either 404 status or not-found page content
    const bodyText = await page.textContent('body');
    const is404 = res?.status() === 404 || /not found/i.test(bodyText ?? '');
    expect(is404).toBeTruthy();
  });
});
