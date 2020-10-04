import { Injectable } from 'injection-js';
import { ParameterizedContext } from 'koa';
import { Configuration } from '../configuration/configuration';
import { KoaMiddlewareInterface, Middleware } from '../core';

// This is a fix for setting secure cookies from a HTTP server

@Injectable()
@Middleware({ type: 'before' })
export class SecureCookieMiddleware implements KoaMiddlewareInterface {
  constructor(private _configuration: Configuration) {}

  async use(context: ParameterizedContext, next: (err?: Error) => Promise<unknown>): Promise<void> {
    if (!this._configuration.disableSecureCookies) {
      context.cookies.secure = true;
    }

    await next();
  }
}
