import { ReflectiveInjector, Provider, Injector } from 'injection-js';
import { Server } from './server';
import { CORE_MODULE_PROVIDERS } from './core.module';
import { Logger } from './logger/logger.interface';
import { COOL_MODULE_METADATA_KEY, CoolModuleConfiguration } from './metadata/cool-module.metadata';
import { PROCESS, APPLICATION_MODULE_METADATA } from './injector/internal-injection-tokens';
import { LOGGER } from './injector/external-injection-tokens';

class Platform {
  public async bootstrapModuleAsync(applicationModule: any) {
    if (!applicationModule) {
      throw new Error('Please provide a module for bootstrapping!');
    }

    const applicationModuleMetadata: CoolModuleConfiguration = Reflect.getMetadata(COOL_MODULE_METADATA_KEY, applicationModule);

    if (!applicationModuleMetadata) {
      throw new Error('Cannot find CoolModule!');
    }

    const providers = [
      ...CORE_MODULE_PROVIDERS,
      { provide: APPLICATION_MODULE_METADATA, useValue: applicationModuleMetadata },
    ];

    this._collectProvidersRecursively(applicationModuleMetadata, providers);

    const serverModule = ReflectiveInjector.resolveAndCreate(providers);

    const process: NodeJS.Process = serverModule.get(PROCESS);
    if (!process) { throw new Error('nodejs process provider not found!'); }

    const server: Server = serverModule.get(Server);
    if (!server) { throw new Error('Server provider not found!'); }

    const logger: Logger = serverModule.get(LOGGER);
    if (!logger) { throw new Error('LOGGER provider not found!'); }

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

  private _collectProvidersRecursively(applicationModuleMetadata: CoolModuleConfiguration, providers: Provider[]) {
    providers.push(...(applicationModuleMetadata.controllers || []));
    providers.push(...(applicationModuleMetadata.globalMiddlewares || []));
    providers.push(...(applicationModuleMetadata.providers || []));
    providers.push(...(applicationModuleMetadata.startProviders || []));
    providers.push(...(applicationModuleMetadata.stopProviders || []));

    if (!applicationModuleMetadata.imports) {
      return;
    }

    for (const childModule of applicationModuleMetadata.imports) {
      const childModuleMetadata: CoolModuleConfiguration = Reflect.getMetadata(COOL_MODULE_METADATA_KEY, childModule);

      if (!childModuleMetadata) {
        throw new Error('Cannot find CoolModule!');
      }

      this._collectProvidersRecursively(childModuleMetadata, providers);
    }
  }

  private _registerOnUnhandledRejections(logger: Logger) {
    process.on('unhandledRejection', (error: Error) => {
      console.error(' ' + error.message);

      logger.error(error);
    });
  }

  private _registerOnStopSignal(server: Server) {
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

export const platform = () => {
  return new Platform();
};