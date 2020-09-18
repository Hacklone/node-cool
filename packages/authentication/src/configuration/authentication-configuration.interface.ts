export interface AuthenticationConfiguration {
  sessionSecret?: string;

  google?: {
    enabled: boolean;

    clientId?: string;
    clientSecret?: string;
  };

  facebook?: {
    enabled: boolean;

    clientId?: string;
    clientSecret?: string;
  };

  loginSuccessRedirectUrl?: string;
  loginFailureRedirectUrl?: string;

  logoutRedirectUrl?: string;

  disableAutomaticRegistration?: boolean;
}