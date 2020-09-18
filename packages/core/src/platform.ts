import { ReflectiveInjector, Provider } from 'injection-js';
import { Server } from './server';
import { CORE_MODULE_PROVIDERS } from './core.module';
import { Logger } from './logger/logger.interface';
import {
  COOL_MODULE_METADATA_KEY,
  CoolModuleConfiguration,
  CoolModule,
} from './metadata/cool-module.metadata';
import {
  PROCESS,
  APPLICATION_MODULE_METADATA,
  ApplicationParts,
  APPLICATION_PARTS,
} from './injector/internal-injection-tokens';
import { LOGGER } from './injector/external-injection-tokens';

class Platform {
  public async bootstrapModuleAsync(applicationModule: unknown) {
    if (!applicationModule) {
      throw new Error('Please provide a module for bootstrapping!');
    }

    const applicationModuleMetadata = <
      CoolModuleConfiguration // eslint-disable-next-line @typescript-eslint/ban-types
    >Reflect.getMetadata(COOL_MODULE_METADATA_KEY, <Object>applicationModule);

    if (!applicationModuleMetadata) {
      throw new Error('Cannot find CoolModule!');
    }

    const applicationParts: ApplicationParts = {
      controllers: [],
      middlewares: [],
      startHandlers: [],
      stopHandlers: [],
    };

    const providers = [
      ...CORE_MODULE_PROVIDERS,
      {
        provide: APPLICATION_MODULE_METADATA,
        useValue: applicationModuleMetadata,
      },
      {
        provide: APPLICATION_PARTS,
        useValue: applicationParts,
      },
    ];

    this._collectProvidersAndApplicationPartsRecursively(applicationModuleMetadata, providers, applicationParts);

    const serverModule = ReflectiveInjector.resolveAndCreate(providers);

    const process = <NodeJS.Process>serverModule.get(PROCESS);
    if (!process) {
      throw new Error('nodejs process provider not found!');
    }

    const server = <Server>serverModule.get(Server);
    if (!server) {
      throw new Error('Server provider not found!');
    }

    const logger = <Logger>serverModule.get(LOGGER);
    if (!logger) {
      throw new Error('LOGGER provider not found!');
    }

    try {
      this._registerOnUnhandledRejections(logger);

      this._registerOnStopSignal(server);

      await server.startAsync();
    } catch (err) {
      console.error(err);

      logger.error(err);

      process.exit(1);
    }
  }

  private _collectProvidersAndApplicationPartsRecursively(
    moduleMetadata: CoolModuleConfiguration,
    providers: Provider[],
    applicationParts: ApplicationParts,
  ) {
    providers.push(...(moduleMetadata.controllers || []));
    providers.push(...(moduleMetadata.globalMiddlewares || []));
    providers.push(...(moduleMetadata.providers || []));
    providers.push(...(moduleMetadata.startProviders || []));
    providers.push(...(moduleMetadata.stopProviders || []));

    applicationParts.controllers.push(...(moduleMetadata.controllers || []));
    applicationParts.middlewares.push(...(moduleMetadata.globalMiddlewares || []));
    applicationParts.startHandlers.push(...(moduleMetadata.startProviders || []));
    applicationParts.stopHandlers.push(...(moduleMetadata.stopProviders || []));

    if (!moduleMetadata.imports) {
      return;
    }

    for (const childModule of moduleMetadata.imports) {
      const childModuleMetadata = CoolModule.getConfiguration(childModule);

      if (!childModuleMetadata) {
        throw new Error('Cannot find CoolModule!');
      }

      this._collectProvidersAndApplicationPartsRecursively(childModuleMetadata, providers, applicationParts);
    }
  }

  private _registerOnUnhandledRejections(logger: Logger) {
    process.on('unhandledRejection', (error: Error) => {
      console.error(' ' + error.message);

      logger.error(error);
    });
  }

  private _registerOnStopSignal(server: Server): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    process.on('SIGINT', async () => {
      let hasError = false;

      try {
        await server.stopAsync();
      } catch {
        hasError = true;
      }

      process.exit(hasError ? 1 : 0);
    });
  }
}

export const platform: () => Platform = () => {
  return new Platform();
};
