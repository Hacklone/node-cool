import { FacebookAuthenticationStrategyFactory } from './authentication/facebook-authentication-strategy.factory';
import { CoolModule, Type } from '@node-cool/core';

import { AuthenticationPersistenceProvider } from './authentication/authentication-persistence.provider';
import { GoogleAuthenticationStrategyFactory } from './authentication/google-authentication-strategy.factory';
import { AuthenticationConfiguration } from './configuration/authentication-configuration.interface';
import { GoogleAuthenticationController } from './controllers/google-authentication.controller';
import { LogoutAuthenticationController } from './controllers/logout-authentication.controller';
import { FacebookAuthenticationController } from './controllers/facebook-authentication.controller';
import { AUTHENTICATION_CONFIGURATION, AUTHENTICATION_PERSISTENCE_PROVIDER } from './injection-tokens';

import { ServerStartHandler } from './start-handler';
import { LoggedInValidatorMiddleware } from './middlewares/logged-in-validator.middleware';

export * from './configuration/authentication-configuration.interface';
export * from './authentication/authentication-type.enum';
export * from './authentication/user-session.interface';
export * from './authentication/application-state.interface';
export * from './authentication/authentication-persistence.provider';

@CoolModule({
  providers: [GoogleAuthenticationStrategyFactory, FacebookAuthenticationStrategyFactory],
  globalMiddlewares: [
    LoggedInValidatorMiddleware,
  ],
  startProviders: [ServerStartHandler],
})
export class AuthenticationModule {
  public static forRoot(moduleConfiguration: {
    persistenceProvider: Type<AuthenticationPersistenceProvider>;
    configuration?: AuthenticationConfiguration;
  }): Type<AuthenticationModule> {
    const coolModuleMetadata = CoolModule.getConfiguration(AuthenticationModule);

    coolModuleMetadata.providers = coolModuleMetadata.providers || [];

    coolModuleMetadata.providers.push(...[
      { provide: AUTHENTICATION_CONFIGURATION, useValue: moduleConfiguration.configuration },
      { provide: AUTHENTICATION_PERSISTENCE_PROVIDER, useClass: moduleConfiguration.persistenceProvider },
    ]);

    coolModuleMetadata.controllers = coolModuleMetadata.controllers || [];

    coolModuleMetadata.controllers.push(LogoutAuthenticationController);

    if (moduleConfiguration.configuration?.google?.enabled) {
      coolModuleMetadata.controllers.push(GoogleAuthenticationController);
    }

    if (moduleConfiguration.configuration?.facebook?.enabled) {
      coolModuleMetadata.controllers.push(FacebookAuthenticationController);
    }

    return AuthenticationModule;
  }
}
