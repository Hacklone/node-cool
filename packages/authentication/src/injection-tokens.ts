import { InjectionToken } from '@node-cool/core';
import { AuthenticationPersistenceProvider } from './authentication/authentication-persistence.provider';
import { AuthenticationConfiguration } from './configuration/authentication-configuration.interface';

export const AUTHENTICATION_CONFIGURATION = new InjectionToken<AuthenticationConfiguration>('authentication configuration');
export const AUTHENTICATION_PERSISTENCE_PROVIDER = new InjectionToken<AuthenticationPersistenceProvider>('AuthenticationPersistenceProvider');