import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/practice-login-form');
});

test('user can login with valid credentials', async ({ page }) => {
  await page.getByTestId('login-email').fill('user@premiumbank.com');
  await page.getByTestId('login-password').fill('Bank@123');

  await page.getByTestId('login-submit').click({ noWaitAfter: true });

  await expect(page.getByTestId('login-success')).toBeVisible();
});

test('user cannot login with an invalid password', async ({ page }) => {
  await page.getByTestId('login-email').fill('user@premiumbank.com');
  await page.getByTestId('login-password').fill('WrongPassword123');

  await page.getByTestId('login-submit').click();

  await expect(page.getByTestId('login-error')).toHaveText(
    'Invalid email id and password',
  );
});

test('user cannot login with an invalid email', async ({ page }) => {
  await page.getByTestId('login-email').fill('wrong@example.com');
  await page.getByTestId('login-password').fill('Bank@123');

  await page.getByTestId('login-submit').click();

  await expect(page.getByTestId('login-error')).toHaveText(
    'Invalid email id and password',
  );
});

test('user cannot login with empty credentials', async ({ page }) => {
  await page.getByTestId('login-submit').click();

  await expect(page.getByTestId('login-error')).toBeVisible();
});

test('user can select remember me', async ({ page }) => {
  await page.getByTestId('login-remember').check();

  await expect(page.getByTestId('login-remember')).toBeChecked();
});

test('user can complete the password recovery process', async ({ page }) => {
  await page.getByTestId('login-forgot-password').click();

  await expect(
    page.getByRole('heading', { name: 'Forgot Password' }),
  ).toBeVisible();

  // Step 1: Enter registered email
  await page.getByTestId('forgot-email').fill('user@premiumbank.com');

  await page.getByTestId('forgot-email-submit').click();

  await expect(
    page.getByRole('heading', { name: 'Verify Security Code' }),
  ).toBeVisible();

  // Step 2: Enter security code
  await page.getByTestId('forgot-code').fill('BANK1234');
  await page.getByTestId('forgot-code-submit').click();

  await expect(
    page.getByRole('heading', { name: 'Reset Password' }),
  ).toBeVisible();

  // Step 3: Reset password
  await page.getByTestId('forgot-current-password').fill('Bank@123');
  await page.getByTestId('forgot-new-password').fill('NewBank@456');
  await page.getByTestId('forgot-confirm-password').fill('NewBank@456');

  await page.getByTestId('forgot-submit').click();

  await expect(
    page.getByRole('heading', { name: 'Password Changed Successfully!' }),
  ).toBeVisible();
});
