import { test, expect } from '@playwright/test';
test('customer can navigate from the home page to practice sites', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'The Ultimate Automation Playground' }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Start Practicing' }).click();

  await expect(
    page.getByRole('heading', { name: 'Practice Sites' }),
  ).toBeVisible();
});
