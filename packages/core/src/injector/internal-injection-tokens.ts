import { InjectionToken } from 'injection-js';
import { CoolModuleConfiguration } from '../metadata/cool-module.metadata';

export const APPLICATION_MODULE_METADATA = new InjectionToken<CoolModuleConfiguration>('Application Module Metadata');
export const PROCESS = new InjectionToken<NodeJS.Process>('process');
