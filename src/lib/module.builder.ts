import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ChargiliOpions } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ChargiliOpions>().build();
