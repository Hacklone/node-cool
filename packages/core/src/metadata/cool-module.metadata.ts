import { Provider, Type } from 'injection-js';

export const COOL_MODULE_METADATA_KEY = 'CoolModule';

export interface CoolModuleConfiguration {
  controllers?: Provider[];
  
  providers?: Provider[];

  imports?: Type<any>[];
  
  globalMiddlewares?: Provider[];

  configuration?: {
    crossOriginDomains?: string[];
  };

  startProviders?: Provider[];
  
  stopProviders?: Provider[];
}

export function CoolModule(configuration: CoolModuleConfiguration) {
  return function (target: Function) {
    Reflect.defineMetadata(COOL_MODULE_METADATA_KEY, configuration, target);
  };
}