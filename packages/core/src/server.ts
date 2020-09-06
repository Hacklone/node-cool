import { StartHandler } from './configuration/start-handler.interface';
import { CoolModuleConfiguration } from './metadata/cool-module.metadata';
import { Configuration } from './configuration/configuration';
import { Injectable, Injector, Inject, Provider } from 'injection-js';
import { Logger } from './logger/logger.interface';
import { useContainer, useKoaServer } from 'routing-controllers';
import { APPLICATION_MODULE_METADATA } from './injector/internal-injection-tokens';
import * as Koa from 'koa';
import * as http from 'http';
import { LOGGER, ERROR_HANDLER_FACTORY } from './injector/external-injection-tokens';
import { StopHandler } from './configuration/stop-handler.interface';

const koaCors = require('@koa/cors');

@Injectable()
export class Server {
  constructor(@Inject(LOGGER) private _logger: Logger,
    @Inject(APPLICATION_MODULE_METADATA) private _applicationMetadata: CoolModuleConfiguration,
    @Inject(ERROR_HANDLER_FACTORY) private _errorHandlerFactory: () => Provider,
    private _configuration: Configuration,
    private _serverModule: Injector) {

  }

  public async startAsync() {
    this._logger.verbose(`Starting server on port: ${this._configuration.port}`);

    useContainer(this._serverModule);

    let app = new Koa();

    this._tryAddCORSMiddleware(app);

    await this._invokeStartProvidersAsync(app);

    app = this._configureServer(app);

    this._startListening(app);

    this._logger.verbose(`Server started`);
  }

  public async stopAsync() {
    this._logger.verbose('Stopping server');

    await this._invokeStopProvidersAsync();

    this._logger.verbose('Server stopped');
  }

  private _startListening(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
    http.createServer(app.callback()).listen(this._configuration.port);

    this._logger.verbose(`Listening started on port: ${this._configuration.port}`);
  }

  private async _invokeStartProvidersAsync(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
    if (!this._applicationMetadata.startProviders) {
      return;
    }

    this._logger.verbose('Invoking start providers');

    for (const provider of this._applicationMetadata.startProviders) {
      const providerInstance: StartHandler = this._serverModule.get(provider);

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
      const providerInstance: StopHandler = this._serverModule.get(provider);

      if (!providerInstance.onStopAsync) {
        throw new Error('No onStopAsync() function found');
      }

      await providerInstance.onStopAsync();
    }
  }

  private _configureServer(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
    let controllers: Function[] = [];

    if (this._applicationMetadata.controllers) {
      controllers = controllers.concat(<Function[]>this._applicationMetadata.controllers);
    }

    let middlewares: Provider[] = [
      this._errorHandlerFactory(),
    ];

    if (this._applicationMetadata.globalMiddlewares) {
      middlewares = middlewares.concat(this._applicationMetadata.globalMiddlewares);
    }

    app = useKoaServer(app, {
      routePrefix: '/api',
      controllers: controllers,
      middlewares: <Function[]>middlewares,
      defaultErrorHandler: false,
    });

    return app;
  }

  private _tryAddCORSMiddleware(app: any) {
    if (!this._configuration.crossOrigin.enabled) {
      return;
    }

    this._logger.verbose('Adding Cross Origin Domains');

    app.use(koaCors({
      origin: (request: any) => {
        if (this._configuration.crossOrigin.domains.includes(request.headers.origin)) {
          return request.headers.origin;
        }

        return this._configuration.crossOrigin.domains[0];
      },
    }));
  }
}