# Configuration

| Name                      | Description                                           | Environment variable     | Configuration variable                  | Default value    |
| ------------------------- | ----------------------------------------------------- | ------------------------ | --------------------------------------- | ---------------- |
| Session secret            | Secret used for signing session                       | `SESSION_SECRET`         | `sessionSecret: string`                 | null             |
| Google client id          | OAuth2 Client id provided by Google                   | `GOOGLE_CLIENT_ID`       | `google.clientId: string`               | null             |
| Google client secret      | OAuth2 Client secret provided by Google               | `GOOGLE_CLIENT_SECRET`   | `google.clientSecret: string`           | null             |
| Facebook client id        | OAuth2 Client id provided by Facebook                 | `FACEBOOK_CLIENT_ID`     | `facebook.clientId: string`             | null             |
| Facebook client secret    | OAuth2 Client secret provided by Facebook             | `FACEBOOK_CLIENT_SECRET` | `facebook.clientSecret: string`         | null             |
| Successful Login Redirect | Url to redirect to after successful login             | -                        | `loginSuccessRedirectUrl: string`       | '/login-success' |
| Failed Login Redirect     | Url to redirect to after failed login                 | -                        | `loginFailureRedirectUrl: string`       | null             |
| Logout Redirect           | Url to redirect to after logout                       | -                        | `logoutRedirectUrl: string`             | '/logout'        |
| Automatic registration    | Disable automatic registration for unregistered users | -                        | `disableAutomaticRegistration: boolean` | false            |
