/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { BasicLogger } from './logger/basic-logger';
import { CryptoUtils } from './utils/crypto-utils';
import { Server } from './server';
import { Provider } from 'injection-js';
import { Configuration } from './configuration/configuration';
import { PROCESS } from './injector/internal-injection-tokens';
import { DateProvider } from './utils/date.provider';
import { ERROR_HANDLER_FACTORY, LOGGER } from './injector/external-injection-tokens';

export const CORE_MODULE_PROVIDERS: Provider[] = [
  Server,
  Configuration,

  ErrorHandlerMiddleware,

  DateProvider,
  CryptoUtils,

  { provide: LOGGER, useClass: BasicLogger },
  { provide: PROCESS, useValue: process },
  { provide: ERROR_HANDLER_FACTORY, useValue: () => ErrorHandlerMiddleware },
];
