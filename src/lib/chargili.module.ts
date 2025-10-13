import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './module.builder';
import { ChargiliService } from './chargili.service';

@Module({
  imports: [],
  providers: [ChargiliService],
  exports: [ChargiliService],
})
export class ChargiliModule extends ConfigurableModuleClass {}
