import { StartHandler, LOGGER, Logger, Inject, ServerApplication, Configuration } from '@node-cool/core';
import { FacebookAuthenticationStrategyFactory } from './authentication/facebook-authentication-strategy.factory';
import { GoogleAuthenticationStrategyFactory } from './authentication/google-authentication-strategy.factory';
import * as koaSession from 'koa-session';
import * as koaPassport from 'koa-passport';
import { AuthenticationConfiguration } from './configuration/authentication-configuration.interface';
import { UserSession } from './authentication/user-session.interface';
import { AUTHENTICATION_CONFIGURATION } from './injection-tokens';

export class ServerStartHandler implements StartHandler {
  constructor(
    @Inject(AUTHENTICATION_CONFIGURATION) private _authenticationConfiguration: AuthenticationConfiguration,
    private _configuration: Configuration,
    private _googleAuthenticationStrategyFactory: GoogleAuthenticationStrategyFactory,
    private _facebookAuthenticationStrategyFactory: FacebookAuthenticationStrategyFactory,
    @Inject(LOGGER) private _logger: Logger,
  ) {}

  public onStartAsync(app: ServerApplication): Promise<void> {
    this._addXSRFExceptions();

    this._addSessionMiddleware(app);

    this._addPassportMiddleware(app);

    return Promise.resolve();
  }

  private _addXSRFExceptions() {
    if (this._authenticationConfiguration.google?.enabled) {
      this._configuration.xsrfExcludeRoutes.push(/^\/api\/authentication\/google(\/callback(\?.*)?)?$/);
    }

    if (this._authenticationConfiguration.facebook?.enabled) {
      this._configuration.xsrfExcludeRoutes.push(/^\/api\/authentication\/facebook(\/callback(\?.*)?)?$/);
    }
  }

  private _addPassportMiddleware(app: ServerApplication) {
    this._logger.verbose('Adding Passport.js middleware');

    if (this._authenticationConfiguration.google?.enabled) {
      const googleOAuthAuthenticationStrategy = this._googleAuthenticationStrategyFactory.create();

      koaPassport.use(googleOAuthAuthenticationStrategy);
    }

    if (this._authenticationConfiguration.facebook?.enabled) {
      const facebookOAuthAuthenticationStrategy = this._facebookAuthenticationStrategyFactory.create();

      koaPassport.use(facebookOAuthAuthenticationStrategy);
    }

    koaPassport.serializeUser((user: UserSession, done: (error: Error | null, serialized?: string) => void) => {
      try {
        return done(null, JSON.stringify(user));
      } catch (e) {
        done(e);
      }
    });

    koaPassport.deserializeUser((userJson: string, done: (error: Error | null, userSession?: UserSession) => void) => {
      try {
        return done(null, JSON.parse(userJson));
      } catch (e) {
        done(e);
      }
    });

    this._registerMiddleware(app, koaPassport.initialize());
    this._registerMiddleware(app, koaPassport.session());
  }

  private _addSessionMiddleware(app: ServerApplication) {
    this._logger.verbose('Adding Session middleware');

    const sessionSecret =
      this._configuration.getConfigurationByKey('SESSION_SECRET') || this._authenticationConfiguration.sessionSecret;

    if (!sessionSecret) {
      throw new Error('No session secret set!');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    app.keys = [sessionSecret];

    this._registerMiddleware(app, koaSession({}, app));
  }

  private _registerMiddleware(app: ServerApplication, middleware: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    app.use(<any>middleware);
  }
}
