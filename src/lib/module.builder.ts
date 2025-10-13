import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ChargilyClientOptions } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ChargilyClientOptions>().build();
