/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CoolModule } from '@node-cool/core';
import { DatabaseModule } from '@node-cool/database';

import { ExampleController } from './controllers/example.controller';
import { ExampleService } from './services/example.service';

@CoolModule({
  controllers: [ExampleController],
  providers: [ExampleService],
  imports: [DatabaseModule],
  configuration: {},
})
export class ServerModule {}
