import { Inject, Injectable } from 'injection-js';
import { ParameterizedContext } from 'koa';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { UnauthorizedApplicationError } from '../errors/unauthorized.error';
import { APPLICATION_MODULE_METADATA } from '../injector/internal-injection-tokens';
import { CoolModuleConfiguration } from '../metadata/cool-module.metadata';

@Injectable()
@Middleware({ type: 'before' })
export class XSRFTokenValidatorMiddleware implements KoaMiddlewareInterface {
  private _excludedRoutes: RegExp[] = [];

  constructor(@Inject(APPLICATION_MODULE_METADATA) private _applicationMetadata: CoolModuleConfiguration) {
    this._excludedRoutes.push(/^\/api\/settings\/xsrf-token$/);

    if (this._applicationMetadata.xsrfValidation?.excludeRoutes?.length) {
      this._excludedRoutes.push(...this._applicationMetadata.xsrfValidation.excludeRoutes);
    }
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
