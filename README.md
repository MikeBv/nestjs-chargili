# @zaki-g/chargily

A NestJS module for integrating Chargily Pay™ V2 payment gateway into your application.

[![npm version](https://badge.fury.io/js/%40zaki-g%2Fchargily.svg)](https://www.npmjs.com/package/@zaki-g/chargily)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @zaki-g/chargily
# or
pnpm install @zaki-g/chargily
# or
yarn add @zaki-g/chargily
```

## Quick Start

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { ChargiliModule } from '@zaki-g/chargily';

@Module({
  imports: [
    ChargiliModule.register({
      api_key: 'your_api_key_here',
      mode: 'test', // or 'live'
    }),
  ],
})
export class AppModule {}
```

### 2. Async Configuration (Recommended)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChargiliModule } from '@zaki-g/chargily';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ChargiliModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        api_key: configService.get<string>('CHARGILY_API_KEY'),
        mode: configService.get<'test' | 'live'>('CHARGILY_MODE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 3. Use the Service

```typescript
import { Injectable } from '@nestjs/common';
import { ChargiliService } from '@zaki-g/chargily';

@Injectable()
export class PaymentService {
  constructor(private readonly chargilyService: ChargiliService) {}

  async createPayment() {
    const checkout = await this.chargilyService.createCheckout({
      amount: 5000, // Amount in cents (50.00 DZD)
      currency: 'dzd',
      success_url: 'https://your-site.com/success',
      failure_url: 'https://your-site.com/failure',
    });

    return checkout.checkout_url; // Redirect user to this URL
  }
}
```

## Environment Variables

Create a `.env` file:

```env
CHARGILY_API_KEY=test_pk_your_key_here
CHARGILY_MODE=test
```

## API Reference

### Balance

Get your account balance information.

```typescript
const balance = await chargilyService.getBalance();
```

**[→ Chargily Docs: Balance](https://dev.chargily.com/pay-v2/api-reference/balance)**

---

### Customers

#### Create Customer
```typescript
const customer = await chargilyService.createCustomer({
  name: 'Ahmed Benali',
  email: 'ahmed@example.com',
  phone: '+213555123456',
  address: {
    country: 'DZ',
    state: 'Algiers',
    address: '123 Rue Didouche Mourad',
  },
});
```

#### Get Customer
```typescript
const customer = await chargilyService.getCustomer('customer_id');
```

#### Update Customer
```typescript
const customer = await chargilyService.updateCustomer('customer_id', {
  email: 'newemail@example.com',
});
```

#### Delete Customer
```typescript
await chargilyService.deleteCustomer('customer_id');
```

#### List Customers
```typescript
const customers = await chargilyService.listCustomers(10, 1); // per_page, page
```

**[→ Chargily Docs: Customers](https://dev.chargily.com/pay-v2/api-reference/customers/create)**

---

### Products

#### Create Product
```typescript
const product = await chargilyService.createProduct({
  name: 'Premium Subscription',
  description: 'Monthly premium access',
  images: ['https://example.com/image.jpg'],
});
```

#### Get Product
```typescript
const product = await chargilyService.getProduct('product_id');
```

#### Update Product
```typescript
const product = await chargilyService.updateProduct('product_id', {
  name: 'Updated Name',
});
```

#### Delete Product
```typescript
await chargilyService.deleteProduct('product_id');
```

#### List Products
```typescript
const products = await chargilyService.listProducts(10, 1);
```

#### Get Product Prices
```typescript
const prices = await chargilyService.getProductPrices('product_id', 10, 1);
```

**[→ Chargily Docs: Products](https://dev.chargily.com/pay-v2/api-reference/products/create)**

---

### Prices

#### Create Price
```typescript
const price = await chargilyService.createPrice({
  amount: 5000, // 50.00 DZD
  currency: 'dzd',
  product_id: 'product_id',
});
```

#### Get Price
```typescript
const price = await chargilyService.getPrice('price_id');
```

#### Update Price
```typescript
const price = await chargilyService.updatePrice('price_id', {
  metadata: { featured: true },
});
```

#### List Prices
```typescript
const prices = await chargilyService.listPrices(10, 1);
```

**[→ Chargily Docs: Prices](https://dev.chargily.com/pay-v2/api-reference/prices/create)**

---

### Checkouts

#### Create Checkout
```typescript
const checkout = await chargilyService.createCheckout({
  items: [
    { price: 'price_id', quantity: 1 }
  ],
  success_url: 'https://your-site.com/success',
  failure_url: 'https://your-site.com/failure',
  customer_id: 'customer_id', // Optional
  locale: 'ar', // 'ar', 'en', or 'fr'
});

// Redirect user to: checkout.checkout_url
```

#### Get Checkout
```typescript
const checkout = await chargilyService.getCheckout('checkout_id');
```

#### List Checkouts
```typescript
const checkouts = await chargilyService.listCheckouts(10, 1);
```

#### Get Checkout Items
```typescript
const items = await chargilyService.getCheckoutItems('checkout_id', 10, 1);
```

#### Expire Checkout
```typescript
await chargilyService.expireCheckout('checkout_id');
```

**[→ Chargily Docs: Checkouts](https://dev.chargily.com/pay-v2/api-reference/checkouts/create)**

---

### Payment Links

#### Create Payment Link
```typescript
const paymentLink = await chargilyService.createPaymentLink({
  name: 'Product Payment',
  items: [
    { 
      price: 'price_id', 
      quantity: 1,
      adjustable_quantity: false 
    }
  ],
  after_completion_message: 'Thank you!',
});

// Share: paymentLink.url
```

#### Get Payment Link
```typescript
const link = await chargilyService.getPaymentLink('payment_link_id');
```

#### Update Payment Link
```typescript
const link = await chargilyService.updatePaymentLink('payment_link_id', {
  name: 'Updated Name',
});
```

#### List Payment Links
```typescript
const links = await chargilyService.listPaymentLinks(10, 1);
```

#### Get Payment Link Items
```typescript
const items = await chargilyService.getPaymentLinkItems('payment_link_id', 10, 1);
```

**[→ Chargily Docs: Payment Links](https://dev.chargily.com/pay-v2/api-reference/payment-links/create)**

---

## Complete Example

```typescript
import { Injectable } from '@nestjs/common';
import { ChargiliService } from '@zaki-g/chargily';

@Injectable()
export class OrderService {
  constructor(private readonly chargilyService: ChargiliService) {}

  async processOrder(userId: string, items: any[]) {
    // 1. Create or get customer
    const customer = await this.chargilyService.createCustomer({
      name: 'Customer Name',
      email: 'customer@example.com',
    });

    // 2. Create checkout
    const checkout = await this.chargilyService.createCheckout({
      items: items.map(item => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      customer_id: customer.id,
      success_url: `https://your-site.com/orders/${orderId}/success`,
      failure_url: `https://your-site.com/orders/${orderId}/failure`,
      locale: 'ar',
      metadata: {
        order_id: orderId,
        user_id: userId,
      },
    });

    return {
      checkoutId: checkout.id,
      checkoutUrl: checkout.checkout_url,
    };
  }

  async verifyPayment(checkoutId: string) {
    const checkout = await this.chargilyService.getCheckout(checkoutId);
    return checkout.status === 'paid';
  }
}
```

## Payment Flow

1. **Create Product & Price** → One-time setup
2. **Create Customer** → Optional, for tracking
3. **Create Checkout** → Generate payment URL
4. **Redirect User** → To `checkout_url`
5. **Verify Payment** → Check checkout status or use webhooks

**[→ Full Integration Guide](https://dev.chargily.com/pay-v2/the-full-guide/first-api-request)**

## Webhooks

For webhook handling, refer to Chargily's webhook documentation:

**[→ Chargily Docs: Webhooks](https://dev.chargily.com/pay-v2/webhooks)**

## TypeScript Support

This package is written in TypeScript and includes full type definitions.

```typescript
import { 
  ChargiliService, 
  Customer, 
  Checkout, 
  Product,
  CreateCheckoutParams 
} from '@zaki-g/chargily';
```

## Error Handling

```typescript
try {
  const checkout = await chargilyService.createCheckout(data);
} catch (error) {
  console.error('Chargily Error:', error.message);
  // Handle error appropriately
}
```

## Testing

Use test mode for development:

```typescript
ChargiliModule.register({
  api_key: 'test_pk_...',
  mode: 'test',
})
```

Get test API keys from [Chargily Dashboard](https://pay.chargily.com/test/dashboard).

## Resources

- [Chargily Pay Documentation](https://dev.chargily.com/pay-v2/introduction)
- [API Reference](https://dev.chargily.com/pay-v2/api-reference/introduction)
- [Chargily Dashboard](https://pay.chargily.com/test/dashboard)
- [Support](https://chargi.link/PayTelegramCommunity)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT © [Zaki](https://github.com/Zaki-goumri)

## Support

- 🐛 [Report a Bug](https://github.com/Zaki-goumri/nestjs-chargili/issues)
- 💡 [Request a Feature](https://github.com/Zaki-goumri/nestjs-chargili/issues)
- 💬 [Chargily Community](https://chargi.link/PayTelegramCommunity)

---

Made with ❤️ for the Algerian developer community
