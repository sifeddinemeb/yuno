import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('home page should have no a11y violations', async ({ page }) => {
    await page.goto('/');

    // Axe analyse
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude(['iframe', 'video']) // ignore heavy sections for quick scan
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
