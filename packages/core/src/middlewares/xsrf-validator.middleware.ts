import { Injectable } from 'injection-js';
import { ParameterizedContext } from 'koa';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { Configuration } from '../configuration/configuration';
import { UnauthorizedApplicationError } from '../errors/unauthorized.error';

@Injectable()
@Middleware({ type: 'before' })
export class XSRFTokenValidatorMiddleware implements KoaMiddlewareInterface {
  private _excludedRoutes: RegExp[] = [];

  constructor(private _configuration: Configuration) {
    this._excludedRoutes.push(/^\/api\/settings\/xsrf-token$/);

    this._excludedRoutes.push(...this._configuration.xsrfExcludeRoutes);
  }

  public async use(context: ParameterizedContext, next: (err?: Error) => Promise<unknown>): Promise<void> {
    if (this._excludedRoutes.some(exception => exception.test(context.request.originalUrl))) {
      await next();

      return;
    }

    const xsrfCookie = context.cookies.get('XSRF-TOKEN');
    const xsrfHeader: string = (<{ [key: string]: string }>context.headers)['x-xsrf-token'];

    const xsrfTokenIsValid = xsrfCookie && xsrfCookie === xsrfHeader;

    if (xsrfTokenIsValid) {
      await next();

      return;
    }

    throw new UnauthorizedApplicationError();
  }
}
