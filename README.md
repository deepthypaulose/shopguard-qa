# ShopGuard QA

ShopGuard QA is a test automation project I built using Playwright and TypeScript.

I created this project to practice UI and API testing using real test scenarios such as login, product search, cart, checkout and authentication.

## What I Tested

### UI Tests

- Login with valid and invalid data
- Product search and filtering
- Add and remove products from cart
- Update product quantity
- Verify price and total
- Complete checkout flow
- Shipping and payment flow

### API Tests

- GET product data
- Test 404 response for a product that does not exist
- POST a new product
- PATCH product data
- DELETE a product
- Check status codes and response data
- Login through API
- Use an access token to access a protected API

## Page Object Model

I used Page Object Model for the e-commerce tests to keep page actions separate from the test logic.

This makes the tests easier to read, reuse and maintain.

## CI/CD

I added GitHub Actions to run the Chromium test suite automatically when changes are pushed to GitHub.

The current Chromium suite has 20 passing tests.

## Tools

- Playwright
- TypeScript
- REST API Testing
- Page Object Model
- Git and GitHub
- GitHub Actions

## Run the Project

Install dependencies:

```bash
npm install
npx playwright install
```

Run the tests:

```bash
npx playwright test --project=chromium
```

Run API tests:

```bash
npx playwright test tests/api --project=chromium
```

View the test report:

```bash
npx playwright show-report
```

## Test Websites

UI tests use the QA Practice demo website.

API tests use DummyJSON for REST API and authentication testing.
