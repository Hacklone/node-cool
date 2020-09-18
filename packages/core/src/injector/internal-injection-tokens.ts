import { InjectionToken, Provider } from 'injection-js';
import { CoolModuleConfiguration } from '../metadata/cool-module.metadata';

export const APPLICATION_MODULE_METADATA = new InjectionToken<CoolModuleConfiguration>('Application Module Metadata');
export const PROCESS = new InjectionToken<NodeJS.Process>('process');
export const APPLICATION_PARTS = new InjectionToken<ApplicationParts>('application parts');

export interface ApplicationParts {
  controllers: Provider[];
  middlewares: Provider[];
  startHandlers: Provider[];
  stopHandlers: Provider[];
}
