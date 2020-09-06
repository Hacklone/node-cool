import 'reflect-metadata';

import { platform } from '@node-cool/core';
import { ServerModule } from './server/server.module';

platform().bootstrapModuleAsync(ServerModule)
  .catch(err => console.error(err));