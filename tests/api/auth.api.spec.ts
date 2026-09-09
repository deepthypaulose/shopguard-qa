import { test, expect } from '@playwright/test';

test('login user and receive access token', async ({ request }) => {
  const credentials = {
    username: 'emilys',
    password: 'emilyspass',
  };
  const response = await request.post('https://dummyjson.com/auth/login', {
    data: credentials,
  });
  expect(response.status()).toBe(200);
  const loginResponse = await response.json();

  expect(loginResponse.username).toBe(credentials.username);
  expect(loginResponse.accessToken).toBeTruthy();
  const profileResponse = await request.get('https://dummyjson.com/auth/me', {
    headers: {
      Authorization: `Bearer ${loginResponse.accessToken}`,
    },
  });
  expect(profileResponse.status()).toBe(200);
  const profile = await profileResponse.json();
  expect(profile.username).toBe(credentials.username);
});
