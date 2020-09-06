import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { Context } from 'koa';
import { Injectable, Inject } from 'injection-js';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Logger } from '../logger/logger.interface';
import { LOGGER } from '../injector/external-injection-tokens';

@Injectable()
@Middleware({ type: 'before' })
export class ErrorHandlerMiddleware implements KoaMiddlewareInterface {
  constructor(@Inject(LOGGER) private _logger: Logger) {
  }

  async use(context: Context, next: (err?: Error) => Promise<any>): Promise<any> {
    try {
      await next();
    } catch (ex) {
      if (ex.isApplicationError) {
        context.body = { error: ex.message };
        context.status = ex.statusCode;
      } else {
        this._logger.error(ex);

        context.body = { error: 'Internal error' };
        context.status = INTERNAL_SERVER_ERROR;
      }
    }
  }
}