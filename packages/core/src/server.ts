import { StartHandler } from './configuration/start-handler.interface';
import { CoolModuleConfiguration } from './metadata/cool-module.metadata';
import { Configuration } from './configuration/configuration';
import { Injectable, Injector, Inject, Provider } from 'injection-js';
import { Logger } from './logger/logger.interface';
import { useContainer, useKoaServer } from 'routing-controllers';
import { APPLICATION_MODULE_METADATA } from './injector/internal-injection-tokens';
import * as Koa from 'koa';
import * as koaCors from '@koa/cors';
import * as http from 'http';
import { LOGGER, ERROR_HANDLER_FACTORY } from './injector/external-injection-tokens';
import { StopHandler } from './configuration/stop-handler.interface';

@Injectable()
export class Server {
  constructor(
    @Inject(LOGGER) private _logger: Logger,
    @Inject(APPLICATION_MODULE_METADATA)
    private _applicationMetadata: CoolModuleConfiguration,
    @Inject(ERROR_HANDLER_FACTORY) private _errorHandlerFactory: () => Provider,
    private _configuration: Configuration,
    private _serverModule: Injector,
  ) {}

  public async startAsync(): Promise<void> {
    this._logger.verbose(`Starting server on port: ${this._configuration.port}`);

    useContainer(this._serverModule);

    let app = new Koa();

    this._tryAddCORSMiddleware(app);

    await this._invokeStartProvidersAsync(app);

    app = this._configureServer(app);

    this._startListening(app);

    this._logger.verbose(`Server started`);
  }

  public async stopAsync(): Promise<void> {
    this._logger.verbose('Stopping server');

    await this._invokeStopProvidersAsync();

    this._logger.verbose('Server stopped');
  }

  private _startListening(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    http.createServer(app.callback()).listen(this._configuration.port);

    this._logger.verbose(`Listening started on port: ${this._configuration.port}`);
  }

  private async _invokeStartProvidersAsync(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
    if (!this._applicationMetadata.startProviders) {
      return;
    }

    this._logger.verbose('Invoking start providers');

    for (const provider of this._applicationMetadata.startProviders) {
      const providerInstance = <StartHandler>this._serverModule.get(provider);

      if (!providerInstance.onStartAsync) {
        throw new Error('No onStartAsync() function found');
      }

      await providerInstance.onStartAsync(app);
    }
  }

  private async _invokeStopProvidersAsync() {
    if (!this._applicationMetadata.stopProviders) {
      return;
    }

    this._logger.verbose('Invoking stop providers');

    for (const provider of this._applicationMetadata.stopProviders) {
      const providerInstance = <StopHandler>this._serverModule.get(provider);

      if (!providerInstance.onStopAsync) {
        throw new Error('No onStopAsync() function found');
      }

      await providerInstance.onStopAsync();
    }
  }

  private _configureServer(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
    let controllers: Provider[] = [];

    if (this._applicationMetadata.controllers) {
      controllers = controllers.concat(this._applicationMetadata.controllers);
    }

    let middlewares: Provider[] = [this._errorHandlerFactory()];

    if (this._applicationMetadata.globalMiddlewares) {
      middlewares = middlewares.concat(this._applicationMetadata.globalMiddlewares);
    }

    app = useKoaServer(app, {
      routePrefix: '/api',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      controllers: <any[]>controllers,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      middlewares: <any[]>middlewares,
      defaultErrorHandler: false,
    });

    return app;
  }

  private _tryAddCORSMiddleware(app: Koa) {
    if (!this._configuration.crossOrigin.enabled) {
      return;
    }

    this._logger.verbose('Adding Cross Origin Domains');

    app.use(
      koaCors({
        origin: (request: Koa.Context) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const origin = <string>request?.headers?.origin;

          if (this._configuration.crossOrigin.domains.includes(origin)) {
            return origin;
          }

          return this._configuration.crossOrigin.domains[0];
        },
      }),
    );
  }
}
