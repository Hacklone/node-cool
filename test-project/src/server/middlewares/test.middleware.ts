import { Injectable, Middleware, CoolMiddleware } from '@node-cool/core';

@Injectable()
@Middleware({ type: 'before' })
export class TestMiddleware implements CoolMiddleware {
  public async use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
    await next();
  }
}