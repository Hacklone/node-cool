/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CoolModule } from '@node-cool/core';
import { DatabaseModule } from '@node-cool/database';
import { AuthenticationModule } from '@node-cool/authentication';

import { ExampleController } from './controllers/example.controller';
import { ExampleService } from './services/example.service';
import { AuthenticationPersistenceService } from './services/authentication-persistence.service';

@CoolModule({
  controllers: [ExampleController],
  providers: [ExampleService],
  imports: [
    DatabaseModule,
    AuthenticationModule.forRoot({
      persistenceProvider: AuthenticationPersistenceService,
      configuration: {
        google: {
          enabled: true,
        },
      },
    }),
  ],
})
export class ServerModule {}
