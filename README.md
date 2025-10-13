# Nest Chargili

A NestJS module for interacting with the Chargily API.

## Installation

```bash
npm install nest-chargili
```

## Configuration

Import and configure the `ChargiliModule` in your `AppModule`.

```typescript
import { Module } from '@nestjs/common';
import { ChargiliModule } from 'nest-chargili';

@Module({
  imports: [
    ChargiliModule.register({
      api_key: 'YOUR_CHARGILI_API_KEY',
      mode: 'test', // or 'live'
    }),
  ],
})
export class AppModule {}
```

## Usage

Inject the `ChargiliService` into your services or controllers.

```typescript
import { Injectable } from '@nestjs/common';
import { ChargiliService } from 'nest-chargili';

@Injectable()
export class MyService {
  constructor(private readonly chargiliService: ChargiliService) {}

  async getBalance() {
    return this.chargiliService.getBalance();
  }
}
```