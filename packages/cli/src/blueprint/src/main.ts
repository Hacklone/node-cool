import 'reflect-metadata';

import * as dotenv from 'dotenv';

dotenv.config();

import { platform } from '@node-cool/core';
import { ServerModule } from './server.module';

platform()
  .bootstrapModuleAsync(ServerModule)
  .catch((err: Error) => console.error(err));
