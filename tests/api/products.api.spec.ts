import { test, expect } from '@playwright/test';

test('get product by id', async ({ request }) => {
  const response = await request.get('https://dummyjson.com/products/1');

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const product = await response.json();

  expect(product.id).toBe(1);
  expect(product.title).toBeTruthy();
  expect(product.category).toBeTruthy();
  expect(product.price).toBeGreaterThan(0);
});

test('returns error for non-existing product', async ({ request }) => {
  const response = await request.get('https://dummyjson.com/products/999999');
  expect(response.status()).toBe(404);
  const errorBody = await response.json();

  expect(errorBody.message).toBe("Product with id '999999' not found");
});

test('create a new product', async ({ request }) => {
  const newProduct = {
    title: 'Test Laptop',
    price: 999,
    category: 'laptops',
  };
  const response = await request.post('https://dummyjson.com/products/add', {
    data: newProduct,
  });
  expect(response.status()).toBe(201);
  const createdProduct = await response.json();

  expect(response.status()).toBe(201);
  expect(createdProduct.title).toBe(newProduct.title);
  expect(createdProduct.price).toBe(newProduct.price);
  expect(createdProduct.category).toBe(newProduct.category);
});
test('update product price', async ({ request }) => {
  const newPrice = {
    price: 12.99,
  };

  const response = await request.patch('https://dummyjson.com/products/1', {
    data: newPrice,
  });

  expect(response.status()).toBe(200);
  const updatedProduct = await response.json();
  expect(updatedProduct.price).toBe(newPrice.price);
});
test('delete a product', async ({ request }) => {
  const response = await request.delete('https://dummyjson.com/products/1');
  expect(response.status()).toBe(200);

  const deletedProduct = await response.json();

  expect(deletedProduct.id).toBe(1);
  expect(deletedProduct.isDeleted).toBe(true);
});
