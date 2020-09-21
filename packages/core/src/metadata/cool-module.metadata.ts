import { Provider, Type } from 'injection-js';

export const COOL_MODULE_METADATA_KEY = 'CoolModule';

export interface CoolModuleConfiguration {
  controllers?: Provider[];

  providers?: Provider[];

  imports?: Type<unknown>[];

  globalMiddlewares?: Provider[];

  xsrfValidation?: {
    disabled?: boolean;

    excludeRoutes?: RegExp[];
  };

  configuration?: {
    port?: number;

    crossOriginDomains?: string[];

    serverAddress?: string;
  };

  startProviders?: Provider[];

  stopProviders?: Provider[];

  beforeListenProviders?: Provider[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CoolModule(configuration: CoolModuleConfiguration): (target: any) => void {
  return function (target: () => unknown) {
    Reflect.defineMetadata(COOL_MODULE_METADATA_KEY, configuration, target);
  };
}

CoolModule.getConfiguration = (target: Type<unknown>): CoolModuleConfiguration => {
  return <CoolModuleConfiguration>Reflect.getMetadata(COOL_MODULE_METADATA_KEY, target);
};
