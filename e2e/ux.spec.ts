import { test, expect } from '@playwright/test';

test('MetaForge critical UX flow', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('http://localhost:3012/');
  await expect(page.getByRole('heading', { name: 'Get The Exact Loadout For Your Mission In 30 Seconds' })).toBeVisible();
  await expect(page.getByText('1. Select game → 2. Choose mission → 3. Get build → 4. Win')).toBeVisible();

  await page.getByRole('link', { name: 'Find My Build' }).click();
  await expect(page).toHaveURL(/\/helldivers2\/calculator/);
  await expect(page.getByRole('heading', { name: 'Find The Exact Build For This Mission' })).toBeVisible();

  await page
    .locator('section')
    .filter({ hasText: 'Step 1' })
    .locator('button:has-text("Terminids"):not([disabled])')
    .first()
    .click();
  await page
    .locator('section')
    .filter({ hasText: 'Step 2' })
    .locator('button:has-text("Defense"):not([disabled])')
    .first()
    .click();
  await expect(page).toHaveURL(/mission=defense/);
  await page.locator('button:has-text("Nightmare"):not([disabled])').first().click();
  await page.locator('button:has-text("YOLO Mode - Solo/Random Ready"):not([disabled])').first().click();
  await page.locator('button:has-text("Balanced"):not([disabled])').first().click();

  await expect(page).toHaveURL(/faction=terminids/);
  await expect(page).toHaveURL(/mission=defense/);
  await expect(page).toHaveURL(/difficulty=nightmare/);
  await expect(page).toHaveURL(/team=randoms/);
  await expect(page).toHaveURL(/style=balanced/);

  await expect(page.getByRole('heading', { name: 'Live Recommendations' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'View Full Build Details' }).first()).toBeVisible();

  await page.getByRole('button', { name: 'View Full Build Details' }).first().click();
  await expect(page.getByText('Calculator > Results > Build Detail')).toBeVisible();
  await expect(page.getByText('Complete Loadout')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy Loadout' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try Another Build' })).toBeVisible();

  await page.getByRole('button', { name: 'Back to Results' }).click();
  await expect(page.getByRole('heading', { name: 'Live Recommendations' })).toBeVisible();
  await expect(page).toHaveURL(/faction=terminids/);
  await expect(page).toHaveURL(/team=randoms/);
});
