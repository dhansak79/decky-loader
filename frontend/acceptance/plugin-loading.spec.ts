import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open Quick Access' }).click();
  await page.getByRole('button', { name: 'Decky' }).click();
  await expect(page.getByRole('region', { name: 'Decky' })).toBeVisible();
});

test('loads a plugin from the Decky panel', async ({ page }) => {
  await page.getByRole('button', { name: 'Load plugin', exact: true }).click();

  await expect(page.getByRole('status')).toHaveText('Sample Plugin loaded from steam-shell');
});

test('shows a timeout when the importer aborts a slow plugin', async ({ page }) => {
  await page.getByRole('button', { name: 'Load slow plugin' }).click();

  await expect(page.getByRole('status')).toHaveText('Sample Plugin timed out');
});

test('does not describe an external abort as an importer timeout', async ({ page }) => {
  await page.getByRole('button', { name: 'Load externally aborted plugin' }).click();

  await expect(page.getByRole('status')).toHaveText('External abort preserved');
});
