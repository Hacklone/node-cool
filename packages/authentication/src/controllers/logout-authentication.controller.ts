import { Ctx, Get, JsonController, Inject, Context } from '@node-cool/core';
import { AUTHENTICATION_CONFIGURATION } from './../injection-tokens';
import { AuthenticationConfiguration } from '../configuration/authentication-configuration.interface';

@JsonController('/authentication/logout')
export class LogoutAuthenticationController {
  constructor(@Inject(AUTHENTICATION_CONFIGURATION) private _authenticationConfiguration: AuthenticationConfiguration) {

  }

  @Get()
  public logout(@Ctx() context: Context): Promise<boolean> {
    context.logout();

    context.redirect(this._authenticationConfiguration.logoutRedirectUrl || '/logout');

    return Promise.resolve(true);
  }
}