import { test, expect } from '@playwright/test';

test('user can search for a product', async ({ page }) => {
  await page.goto('/practice-ecommerece-website');

  await page.getByTestId('ecom-search').fill('Laptop');

  await expect(page.getByRole('img', { name: 'Laptop Pro' })).toBeVisible();

  await expect(page.getByRole('img', { name: 'QPhone 128GB' })).toBeHidden();
});

test('search can return multiple relevant products', async ({ page }) => {
  await page.goto('/practice-ecommerece-website');

  await page.getByTestId('ecom-search').fill('phone');

  const products = page.locator('[data-testid^="view-product-"]');

  const productCount = await products.count();

  expect(productCount).toBeGreaterThan(0);

  for (let i = 0; i < productCount; i++) {
    const product = products.nth(i);
    const productName = await product.textContent();
    expect(productName?.toLowerCase()).toContain('phone');
  }
});

test('user can filter products by category', async ({ page }) => {
  await page.goto('/practice-ecommerece-website');

  await page.getByTestId('ecom-category-electronics').click();

  await expect(page.getByTestId('ecom-result-count')).toContainText(
    'Electronics',
  );

  const products = page.locator('[data-testid^="view-product-"]');

  const productCount = await products.count();

  expect(productCount).toBeGreaterThan(0);

  for (let i = 0; i < productCount; i++) {
    const currentProducts = page.locator('[data-testid^="view-product-"]');

    await currentProducts.nth(i).click();

    await expect(
      page.getByTestId('ecom-product-detail').getByText('Electronics'),
    ).toBeVisible();

    await page.getByTestId('ecom-back-to-products').click();
  }
});

test('user can add a product to the cart', async ({ page }) => {
  await page.goto('/practice-ecommerece-website');

  const laptopCard = page
    .locator('[data-testid^="product-card-"]')
    .filter({ hasText: 'Laptop Pro' });

  await laptopCard.getByRole('button', { name: 'Add to Cart' }).click();

  await page.getByTestId('ecom-cart-button').click();

  const laptopCartItem = page
    .locator('.list-group-item')
    .filter({ hasText: 'Laptop Pro' });

  await expect(laptopCartItem).toBeVisible();

  await expect(page.getByText(/Total:/)).toBeVisible();
});

test('user can remove a product from the cart', async ({ page }) => {
  await page.goto('/practice-ecommerece-website');

  const laptopCard = page
    .locator('[data-testid^="product-card-"]')
    .filter({ hasText: 'Laptop Pro' });

  await laptopCard.getByRole('button', { name: 'Add to Cart' }).click();

  await page.getByTestId('ecom-cart-button').click();

  const laptopCartItem = page
    .locator('.list-group-item')
    .filter({ hasText: 'Laptop Pro' });

  await expect(laptopCartItem).toBeVisible();

  await laptopCartItem.getByRole('button', { name: 'Remove' }).click();

  await expect(laptopCartItem).toBeHidden();
});

test('cart calculates total based on product quantity', async ({ page }) => {
  // Test input
  const quantity = 3;

  await page.goto('/practice-ecommerece-website');

  // Find Laptop Pro
  const laptopCard = page
    .locator('[data-testid^="product-card-"]')
    .filter({ hasText: 'Laptop Pro' });

  // Read current product price
  const priceText = await laptopCard
    .locator('.fw-bold.text-dark.mb-3')
    .textContent();

  // "$1200" → 1200
  const unitPrice = Number(priceText?.replace('$', ''));

  // Calculate expected result
  const expectedTotal = unitPrice * quantity;

  // Set quantity
  await laptopCard
    .locator('[data-testid^="quantity-"]')
    .fill(quantity.toString());

  // Add to cart
  await laptopCard.getByRole('button', { name: 'Add to Cart' }).click();

  // Open cart
  await page.getByTestId('ecom-cart-button').click();

  // Read actual total displayed by the application
  const totalText = await page.getByText('Total: $').textContent();

  const actualTotal = Number(
    totalText?.replace('Total:', '').replace('$', '').trim(),
  );

  expect(actualTotal).toBe(expectedTotal);
});

test('customer can complete checkout', async ({ page }) => {
  const shippingAddress = {
    fullName: 'Test User',
    street: '123 Test Street',
    city: 'Berlin',
    state: 'Berlin',
    zipCode: '10115',
  };

  const paymentDetails = {
    cardNumber: '4111111111111111',
    expiry: '12/30',
    cvv: '123',
  };
  // 1. Open shop
  await page.goto('/practice-ecommerece-website');

  // 2. Find Laptop Pro
  const laptopCard = page
    .locator('[data-testid^="product-card-"]')
    .filter({ hasText: 'Laptop Pro' });

  // 3. Add it to cart
  await laptopCard.getByRole('button', { name: 'Add to Cart' }).click();

  // 4. Open cart
  await page.getByTestId('ecom-cart-button').click();

  // 5. Proceed to checkout
  await page.getByTestId('ecom-proceed-to-buy').click();

  // 6. Fill shipping address
  await page.getByTestId('ecom-address-name').fill(shippingAddress.fullName);

  await expect(page.getByTestId('ecom-address-name')).toHaveValue(
    shippingAddress.fullName,
  );

  await page.getByTestId('ecom-address-street').fill(shippingAddress.street);

  await expect(page.getByTestId('ecom-address-street')).toHaveValue(
    shippingAddress.street,
  );

  await page.getByTestId('ecom-address-city').fill(shippingAddress.city);

  await expect(page.getByTestId('ecom-address-city')).toHaveValue(
    shippingAddress.city,
  );

  await page.getByTestId('ecom-address-state').fill(shippingAddress.state);

  await expect(page.getByTestId('ecom-address-state')).toHaveValue(
    shippingAddress.state,
  );

  await page.getByTestId('ecom-address-zip').fill(shippingAddress.zipCode);

  await expect(page.getByTestId('ecom-address-zip')).toHaveValue(
    shippingAddress.zipCode,
  );

  // 7. Continue to payment
  await page.getByTestId('ecom-save-address').click();

  // Verify that payment screen opened
  await expect(
    page.getByRole('heading', { name: 'Payment Details' }),
  ).toBeVisible();

  // Fill payment details
  await page.getByTestId('ecom-card-number').fill(paymentDetails.cardNumber);

  await page.getByTestId('ecom-expiry').fill(paymentDetails.expiry);

  await page.getByTestId('ecom-cvv').fill(paymentDetails.cvv);

  // Buy
  await page.getByTestId('ecom-buy-now').click();

  // Verify successful order
  await expect(
    page.getByRole('heading', { name: 'Order Successful!' }),
  ).toBeVisible();

  await expect(page.getByText('Woohoo!! Successfully purchased')).toBeVisible();
});
