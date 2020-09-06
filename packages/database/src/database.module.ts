import { CoolModule } from '@node-cool/core';

import { ServerStopHandler } from './stop-handler';
import { ServerStartHandler } from './start-handler';
import { DatabaseConnection } from './database-connection';

export * from 'typeorm';
export { DatabaseConnection } from './database-connection';

@CoolModule({
  providers: [
    DatabaseConnection,
  ],
  startProviders: [
    ServerStartHandler,
  ],
  stopProviders: [
    ServerStopHandler,
  ],
})
export class DatabaseModule {

}