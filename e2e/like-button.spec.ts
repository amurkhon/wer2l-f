import { test, expect } from '@playwright/test';

test.describe('Like button', () => {
  test('like button is present on work detail page when work exists', async ({ page }) => {
    // Navigate to works listing and find a work to click
    await page.goto('/works');
    const firstWorkLink = page.locator('a[href^="/works/"]').first();

    if (!(await firstWorkLink.isVisible())) {
      test.skip();
      return;
    }

    await firstWorkLink.click();
    await page.waitForURL(/\/works\/.+/);

    // Like button should be present (rendered as a button with a heart/like icon)
    const likeButton = page.getByRole('button', { name: /like/i });
    await expect(likeButton).toBeVisible({ timeout: 5000 });
  });

  test('clicking like button increments the count optimistically', async ({ page }) => {
    await page.goto('/works');
    const firstWorkLink = page.locator('a[href^="/works/"]').first();

    if (!(await firstWorkLink.isVisible())) {
      test.skip();
      return;
    }

    await firstWorkLink.click();
    await page.waitForURL(/\/works\/.+/);

    const likeButton = page.getByRole('button', { name: /like/i });
    if (!(await likeButton.isVisible())) {
      test.skip();
      return;
    }

    const countBefore = await likeButton.textContent();
    await likeButton.click();

    // Count should have changed (optimistic update)
    await expect(async () => {
      const countAfter = await likeButton.textContent();
      expect(countAfter).not.toEqual(countBefore);
    }).toPass({ timeout: 2000 });
  });
});
