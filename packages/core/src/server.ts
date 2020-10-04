import { SecureCookieMiddleware } from './middlewares/secure-cookie.middleware';
import { XSRFTokenController } from './controllers/xsrf-token.controller';
import { XSRFTokenValidatorMiddleware } from './middlewares/xsrf-validator.middleware';
import { BeforeListenHandler } from './configuration/before-listen-handler.interface';
import { StartHandler } from './configuration/start-handler.interface';
import { Configuration } from './configuration/configuration';
import { Injectable, Injector, Inject, Provider } from 'injection-js';
import { Logger } from './logger/logger.interface';
import { useContainer, useKoaServer } from 'routing-controllers';
import { ApplicationParts, APPLICATION_PARTS, APPLICATION_MODULE_METADATA } from './injector/internal-injection-tokens';
import * as Koa from 'koa';
import * as koaCors from '@koa/cors';
import * as http from 'http';
import * as https from 'https';
import { LOGGER, ERROR_HANDLER_FACTORY } from './injector/external-injection-tokens';
import { StopHandler } from './configuration/stop-handler.interface';
import { CoolModuleConfiguration } from './metadata/cool-module.metadata';

@Injectable()
export class Server {
  constructor(
    @Inject(LOGGER) private _logger: Logger,
    @Inject(ERROR_HANDLER_FACTORY) private _errorHandlerFactory: () => Provider,
    private _configuration: Configuration,
    @Inject(APPLICATION_MODULE_METADATA) private _applicationMetadata: CoolModuleConfiguration,
    @Inject(APPLICATION_PARTS) private _applicationParts: ApplicationParts,
    private _serverModule: Injector,
  ) {}

  public async startAsync(): Promise<void> {
    this._logger.verbose(`Starting server on port: ${this._configuration.port}`);

    useContainer(this._serverModule);

    let app = new Koa();

    this._tryAddCORSMiddleware(app);

    await this._invokeStartProvidersAsync(app);

    app = this._configureServer(app);

    await this._startListeningAsync(app);

    this._logger.verbose(`Server started`);
  }

  public async stopAsync(): Promise<void> {
    this._logger.verbose('Stopping server');

    await this._invokeStopProvidersAsync();

    this._logger.verbose('Server stopped');
  }

  private async _startListeningAsync(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
    let server: http.Server;

    if (this._applicationMetadata.configuration?.ssl?.enabled) {
      server = https.createServer(
        {
          key: this._applicationMetadata.configuration.ssl.key,
          cert: this._applicationMetadata.configuration.ssl.cert,
        },
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        app.callback(),
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      server = http.createServer(app.callback());
    }

    await this._invokeBeforeListenProvidersAsync(server);

    server.listen(this._configuration.port);

    this._logger.verbose(`Listening started on port: ${this._configuration.port}`);
  }

  private async _invokeBeforeListenProvidersAsync(server: http.Server) {
    if (!this._applicationParts.beforeListenHandlers || !this._applicationParts.beforeListenHandlers.length) {
      return;
    }

    this._logger.verbose('Invoking before listen providers');

    for (const provider of this._applicationParts.beforeListenHandlers) {
      const providerInstance = <BeforeListenHandler>this._serverModule.get(provider);

      if (!providerInstance.onBeforeListenAsync) {
        throw new Error('No onBeforeListenAsync() function found');
      }

      await providerInstance.onBeforeListenAsync(server);
    }
  }

  private async _invokeStartProvidersAsync(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
    if (!this._applicationParts.startHandlers || !this._applicationParts.startHandlers.length) {
      return;
    }

    this._logger.verbose('Invoking start providers');

    for (const provider of this._applicationParts.startHandlers) {
      const providerInstance = <StartHandler>this._serverModule.get(provider);

      if (!providerInstance.onStartAsync) {
        throw new Error('No onStartAsync() function found');
      }

      await providerInstance.onStartAsync(app);
    }
  }

  private async _invokeStopProvidersAsync() {
    if (!this._applicationParts.stopHandlers || !this._applicationParts.stopHandlers.length) {
      return;
    }

    this._logger.verbose('Invoking stop providers');

    for (const provider of this._applicationParts.stopHandlers) {
      const providerInstance = <StopHandler>this._serverModule.get(provider);

      if (!providerInstance.onStopAsync) {
        throw new Error('No onStopAsync() function found');
      }

      await providerInstance.onStopAsync();
    }
  }

  private _configureServer(app: Koa<Koa.DefaultState, Koa.DefaultContext>) {
    const builtInGlobalMiddlewares = [];

    builtInGlobalMiddlewares.push(this._errorHandlerFactory(), SecureCookieMiddleware);

    if (!this._applicationMetadata.configuration?.xsrfValidation?.disabled) {
      builtInGlobalMiddlewares.push(XSRFTokenValidatorMiddleware);
    }

    if (builtInGlobalMiddlewares.length) {
      this._applicationParts.middlewares.unshift(...builtInGlobalMiddlewares);
    }

    const builtInControllers = [];

    if (!this._applicationMetadata.configuration?.xsrfValidation?.disabled) {
      builtInControllers.push(XSRFTokenController);
    }

    if (builtInControllers.length) {
      this._applicationParts.controllers.unshift(...builtInControllers);
    }

    app = useKoaServer(app, {
      routePrefix: '/api',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      controllers: <any[]>this._applicationParts.controllers,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      middlewares: <any[]>this._applicationParts.middlewares,
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
        credentials: true,
        maxAge: 120,
      }),
    );
  }
}
