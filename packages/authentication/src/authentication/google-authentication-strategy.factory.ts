import { AuthenticationConfiguration } from './../configuration/authentication-configuration.interface';
import { AUTHENTICATION_CONFIGURATION, AUTHENTICATION_PERSISTENCE_PROVIDER } from './../injection-tokens';
import { CryptoUtils, Injectable, Inject, Configuration } from '@node-cool/core';
import { Strategy } from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import { AuthenticationPersistenceProvider } from './authentication-persistence.provider';
import { AuthenticationStrategyFactoryBase } from './authentication-strategy-factory.base';
import { AuthenticationType } from './authentication-type.enum';

export interface GoogleProfile {
  id: string;

  displayName: string;

  emails: { value: string }[];

  photos: { value: string }[];
}

@Injectable()
export class GoogleAuthenticationStrategyFactory extends AuthenticationStrategyFactoryBase<GoogleProfile> {
  constructor(
    private _configuration: Configuration,
    cryptoUtils: CryptoUtils,
    @Inject(AUTHENTICATION_PERSISTENCE_PROVIDER) authenticationPersistenceProvider: AuthenticationPersistenceProvider,
    @Inject(AUTHENTICATION_CONFIGURATION) authenticationConfiguration: AuthenticationConfiguration,
  ) {
    super(cryptoUtils, authenticationPersistenceProvider, authenticationConfiguration, AuthenticationType.Google);
  }

  create(): Strategy {
    if (!this._authenticationConfiguration.google) {
      throw new Error('No configuration provided');
    }

    if (!this._configuration.serverAddress) {
      throw new Error('No serverAddress set in server configuration');
    }

    return new OAuth2Strategy(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>{
        clientID: this._configuration.getConfigurationByKey('GOOGLE_CLIENT_ID') || this._authenticationConfiguration.google.clientId,
        clientSecret: this._configuration.getConfigurationByKey('GOOGLE_CLIENT_SECRET') || this._authenticationConfiguration.google.clientSecret,
        callbackURL: `${this._configuration.serverAddress}/api/authentication/google/callback`,
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
        scope: ['profile', 'email'],
      },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (accessToken, refreshToken, profile, done) => {
        await this.authenticateUserAsync(<GoogleProfile>profile, done);
      },
    );
  }

  protected _getAuthenticationIdAsync(profile: GoogleProfile): Promise<string> {
    return Promise.resolve(profile.id);
  }

  protected _getProfileDataAsync(
    profile: GoogleProfile,
  ): Promise<{ name: string; email: string; profileImageUrl: string | null }> {
    return Promise.resolve({
      name: profile.displayName,
      email: this._tryFillEmailFromProfile(profile),
      profileImageUrl: this._tryFillPhotosFromProfile(profile),
    });
  }

  private _tryFillEmailFromProfile(profile: GoogleProfile): string {
    if (!profile || !profile.emails || !profile.emails.length) {
      return 'N/A';
    }

    return profile.emails[0].value;
  }

  private _tryFillPhotosFromProfile(profile: GoogleProfile): string | null {
    if (!profile || !profile.photos || !profile.photos.length) {
      return null;
    }

    return profile.photos[0].value;
  }
}
