import { Inject, KoaMiddlewareInterface, Middleware, ParameterizedContext, UnauthenticatedApplicationError } from '@node-cool/core';
import { Injectable } from 'injection-js';
import { AuthenticationConfiguration } from '../authentication.module';
import { AUTHENTICATION_CONFIGURATION } from '../injection-tokens';

@Injectable()
@Middleware({ type: 'before' })
export class LoggedInValidatorMiddleware implements KoaMiddlewareInterface {
  private _disabledRoutes: RegExp[] = [];

  constructor(@Inject(AUTHENTICATION_CONFIGURATION) private _authenticationConfiguration: AuthenticationConfiguration) {
    this._disabledRoutes.push(...[
      /^\/api\/settings\/xsrf-token$/,
      /^\/api\/authentication\/logout$/,
      /^\/api\/authentication\/(facebook|google)$/,
      /^\/api\/authentication\/(facebook|google)\/callback\?.*/,
    ]);

    if (this._authenticationConfiguration.disableSessionValidationForRoutes?.length) {
      this._disabledRoutes.push(...this._authenticationConfiguration.disableSessionValidationForRoutes);
    }
  }

  public async use(context: ParameterizedContext, next: (err?: Error) => Promise<unknown>): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (this._disabledRoutes.some(exception => exception.test(context.request.originalUrl))) {
      await next();

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (context.isAuthenticated()) {
      await next();

      return;
    }

    throw new UnauthenticatedApplicationError();
  }
}