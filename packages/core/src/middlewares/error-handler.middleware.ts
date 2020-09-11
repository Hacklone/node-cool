/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import { Context } from 'koa';
import { Injectable, Inject } from 'injection-js';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Logger } from '../logger/logger.interface';
import { LOGGER } from '../injector/external-injection-tokens';

@Injectable()
@Middleware({ type: 'before' })
export class ErrorHandlerMiddleware implements KoaMiddlewareInterface {
  constructor(@Inject(LOGGER) private _logger: Logger) {}

  async use(context: Context, next: (err?: Error) => Promise<unknown>): Promise<void> {
    try {
      await next();
    } catch (err) {
      if (err.isApplicationError) {
        context.body = { error: err.message };
        context.status = err.statusCode;
      } else {
        this._logger.error(err);

        context.body = { error: 'Internal error' };
        context.status = INTERNAL_SERVER_ERROR;
      }
    }
  }
}
