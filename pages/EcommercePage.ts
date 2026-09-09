import { Page } from '@playwright/test';

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
}
export class EcommercePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/practice-ecommerece-website');
  }

  async addProductToCart(productName: string) {
    const productCard = this.page
      .locator('[data-testid^="product-card-"]')
      .filter({ hasText: productName });

    await productCard.getByRole('button', { name: 'Add to Cart' }).click();
  }

  async openCart() {
    await this.page.getByTestId('ecom-cart-button').click();
  }

  async proceedToCheckout() {
    await this.page.getByTestId('ecom-proceed-to-buy').click();
  }

  async fillShippingAddress(shippingAddress: ShippingAddress) {
    await this.page
      .getByTestId('ecom-address-name')
      .fill(shippingAddress.fullName);

    await this.page
      .getByTestId('ecom-address-street')
      .fill(shippingAddress.street);

    await this.page.getByTestId('ecom-address-city').fill(shippingAddress.city);

    await this.page
      .getByTestId('ecom-address-state')
      .fill(shippingAddress.state);

    await this.page
      .getByTestId('ecom-address-zip')
      .fill(shippingAddress.zipCode);
  }

  async fillPaymentDetails(paymentDetails: PaymentDetails) {
    await this.page
      .getByTestId('ecom-card-number')
      .fill(paymentDetails.cardNumber);

    await this.page.getByTestId('ecom-expiry').fill(paymentDetails.expiry);

    await this.page.getByTestId('ecom-cvv').fill(paymentDetails.cvv);
  }

  async continueToPayment() {
    await this.page.getByTestId('ecom-save-address').click();
  }

  async buyNow() {
    await this.page.getByTestId('ecom-buy-now').click();
  }
}
