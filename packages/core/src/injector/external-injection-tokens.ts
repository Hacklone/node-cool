import { Logger } from './../logger/logger.interface';
import { InjectionToken, Provider } from 'injection-js';

export const LOGGER = new InjectionToken<Logger>('Logger implementation');
export const ERROR_HANDLER_FACTORY = new InjectionToken<() => Provider>('Error handler middleware factory');