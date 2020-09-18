import { Inject, Get, Ctx, JsonController, Context, UseBefore } from '@node-cool/core';
import * as passport from 'koa-passport';
import { AuthenticationConfiguration } from './../configuration/authentication-configuration.interface';
import { AUTHENTICATION_CONFIGURATION } from '../injection-tokens';

@JsonController('/authentication/google')
export class GoogleAuthenticationController {
  constructor(@Inject(AUTHENTICATION_CONFIGURATION) private _authenticationConfiguration: AuthenticationConfiguration) {

  }

  @Get()
  @UseBefore(passport.authenticate('google'))
  public googleAuthentication(): Promise<boolean> {
    return Promise.resolve(true);
  }

  @Get('/callback')
  @UseBefore(passport.authenticate('google'))
  public googleAuthenticationCallback(@Ctx() context: Context): Promise<boolean> {
    context.redirect(this._authenticationConfiguration.loginSuccessRedirectUrl || '/login-success');

    return Promise.resolve(true);
  }
}