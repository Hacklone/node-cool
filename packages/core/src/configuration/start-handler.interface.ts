import * as Koa from 'koa';

export type ServerApplication = Koa<Koa.DefaultState, Koa.DefaultContext>;
export interface StartHandler {
  onStartAsync(app: ServerApplication): Promise<void>;
}
