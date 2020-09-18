import { AuthenticationConfiguration } from '../configuration/authentication-configuration.interface';
import { AUTHENTICATION_CONFIGURATION, AUTHENTICATION_PERSISTENCE_PROVIDER } from '../injection-tokens';
import { CryptoUtils, Injectable, Inject, Configuration } from '@node-cool/core';
import { Strategy } from 'passport';
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from 'passport-facebook';
import { AuthenticationPersistenceProvider } from './authentication-persistence.provider';
import { AuthenticationStrategyFactoryBase } from './authentication-strategy-factory.base';
import { AuthenticationType } from './authentication-type.enum';

/*export interface FacebookProfile {
  id: string;

  displayName: string;

  emails: { value: string }[];

  photos: { value: string }[];
}*/

@Injectable()
export class FacebookAuthenticationStrategyFactory extends AuthenticationStrategyFactoryBase<FacebookProfile> {
  constructor(
    private _configuration: Configuration,
    cryptoUtils: CryptoUtils,
    @Inject(AUTHENTICATION_PERSISTENCE_PROVIDER) authenticationPersistenceProvider: AuthenticationPersistenceProvider,
    @Inject(AUTHENTICATION_CONFIGURATION) authenticationConfiguration: AuthenticationConfiguration,
  ) {
    super(cryptoUtils, authenticationPersistenceProvider, authenticationConfiguration, AuthenticationType.Facebook);
  }

  create(): Strategy {
    if (!this._authenticationConfiguration.facebook) {
      throw new Error('No configuration provided');
    }

    if (!this._configuration.serverAddress) {
      throw new Error('No serverAddress set in server configuration');
    }

    return new FacebookStrategy(
      {
        clientID: <string>(
          (this._configuration.getConfigurationByKey('FACEBOOK_CLIENT_ID') ||
            this._authenticationConfiguration.facebook.clientId)
        ),
        clientSecret: <string>(
          (this._configuration.getConfigurationByKey('FACEBOOK_CLIENT_SECRET') ||
            this._authenticationConfiguration.facebook.clientSecret)
        ),
        callbackURL: `${this._configuration.serverAddress}/api/authentication/facebook/callback`,
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (
        accessToken: string,
        refreshToken: string,
        profile: FacebookProfile,
        done: (error: unknown, user?: unknown, info?: unknown) => void,
      ) => {
        await this.authenticateUserAsync(profile, done);
      },
    );
  }

  protected _getAuthenticationIdAsync(profile: FacebookProfile): Promise<string> {
    return Promise.resolve(profile.id);
  }

  protected _getProfileDataAsync(
    profile: FacebookProfile,
  ): Promise<{ name: string; email: string; profileImageUrl: string | null }> {
    return Promise.resolve({
      name: profile.displayName,
      email: this._tryFillEmailFromProfile(profile),
      profileImageUrl: this._tryFillPhotosFromProfile(profile),
    });
  }

  private _tryFillEmailFromProfile(profile: FacebookProfile): string {
    if (!profile || !profile.emails || !profile.emails.length) {
      return 'N/A';
    }

    return profile.emails[0].value;
  }

  private _tryFillPhotosFromProfile(profile: FacebookProfile): string | null {
    if (!profile || !profile.photos || !profile.photos.length) {
      return null;
    }

    return profile.photos[0].value;
  }
}
