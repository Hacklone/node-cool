import { Injectable, Middleware, CoolMiddleware } from '@node-cool/core';

@Injectable()
@Middleware({ type: 'before' })
export class TestMiddleware implements CoolMiddleware {
  public async use(context: unknown, next: (err?: unknown) => Promise<unknown>): Promise<unknown> {
    await next();
  }
}