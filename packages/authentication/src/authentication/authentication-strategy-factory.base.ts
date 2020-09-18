import { AuthenticationConfiguration } from './../configuration/authentication-configuration.interface';
import { AuthenticationType } from './authentication-type.enum';
import { UserSession } from './user-session.interface';
import { UnauthenticatedApplicationError, CryptoUtils } from '@node-cool/core';
import { AuthenticationPersistenceProvider } from './authentication-persistence.provider';
import { Strategy } from 'passport';

export interface AuthenticationProfile {
  email: string;

  imageUrl: string;

  displayName: string;
}

export abstract class AuthenticationStrategyFactoryBase<Profile> {
  protected constructor(
    private _cryptoUtils: CryptoUtils,
    private _authenticationPersistenceProvider: AuthenticationPersistenceProvider,
    protected _authenticationConfiguration: AuthenticationConfiguration,
    private _authenticationType: AuthenticationType,
  ) {}

  protected async authenticateUserAsync(
    profile: Profile,
    done: (error: Error | null, session?: UserSession) => void,
  ): Promise<void> {
    try {
      const authenticationId = await this._getAuthenticationIdAsync(profile);

      if (!authenticationId) {
        if (!this._authenticationConfiguration.disableAutomaticRegistration) {
          const userData = await this._getProfileDataAsync(profile);

          await this._authenticationPersistenceProvider.registerUserAsync(authenticationId, this._authenticationType, userData);
        } else {
          throw new UnauthenticatedApplicationError();
        }
      }

      const user = await this._authenticationPersistenceProvider.getUserByAuthenticationIdAsync(
        this._authenticationType,
        authenticationId,
      );

      if (!user) {
        throw new UnauthenticatedApplicationError();
      }

      const session = <UserSession>{
        sessionId: await this._cryptoUtils.getCryptoRandomStringAsync(),
        userId: user.id,
      };

      done(null, session);
    } catch (e) {
      done(e);
    }
  }

  protected abstract _getAuthenticationIdAsync(profile: Profile): Promise<string>;

  protected abstract _getProfileDataAsync(
    profile: Profile,
  ): Promise<{ name: string; email: string; profileImageUrl: string | null }>;

  public abstract create(): Strategy;
}
