import { InjectionToken } from 'injection-js';
export interface Logger {
  verbose(message: string, data?: any): void;
  
  info(message: string, data?: any): void;

  error(error: Error, data?: any): void;
}