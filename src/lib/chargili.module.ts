import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './module.builder';
import { ChargiliService } from './chargili.service';
import { ChargilyClientOptions } from './interfaces/data';
import { CHARGILY_LIVE_URL, CHARGILY_TEST_URL } from './constants';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (options: ChargilyClientOptions) => ({
        baseURL:
          options.mode === 'test'
            ? `${CHARGILY_TEST_URL}${options.version ?? 'v2'}`
            : `${CHARGILY_LIVE_URL}${options.version ?? 'v2'}`,
        headers: {
          Authorization: `Bearer ${options.api_key}`,
          'Content-Type': 'application/json',
        },
      }),
      inject: [MODULE_OPTIONS_TOKEN],
    }),
  ],
  providers: [ChargiliService],
  exports: [ChargiliService],
})
export class ChargiliModule extends ConfigurableModuleClass {}
