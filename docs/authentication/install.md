# Install

`@node-cool` uses [Passport.js](https://www.npmjs.com/package/passport) for authentication.

## 1. Install package

```bash
$ npm install --save @node-cool/authentication
```

## 2. Add authentication persistence provider

```typescript
// ./src/services/authentication/authentication-persistence.provider.ts

import { Injectable } from '@node-cool/core';
import { AuthenticationPersistenceProvider, AuthenticationType } from '@node-cool/authentication';
import { DatabaseConnection } from '@node-cool/database';

@Injectable()
export class MyAuthenticationPersistenceProvider implements AuthenticationPersistenceProvider {
  constructor(private _databaseConnection: DatabaseConnection) {}

  public async getUserByAuthenticationIdAsync(
    authenticationType: AuthenticationType,
    authenticationId: string,
  ): Promise<{ id: string }> {
    return await this._databaseConnection.getRepository(AuthenticationEntity).findOne({
      where: {
        authId: authenticationId,
        type: authenticationType,
      },
    });
  }

  public async registerUserAsync(
    authenticationId: string,
    authenticationType: AuthenticationType,
    userData: { name: string; email: string; profileImageUrl: string | null },
  ): Promise<void> {
    await this._databaseConnection.getRepository(UserEntity)
      .insert({
        name: userData.name,
        email: userData.email,
        profileImageUrl: userData.profileImageUrl,
      });

    await this._databaseConnection.getRepository(AuthenticationEntity)
      .insert({
        authId: authenticationId,
        type: authenticationType,
      });
  }
}
```

## 3. Add AuthenticationModule to your server module

```typescript
// ./src/server.module.ts

import { MyAuthenticationPersistenceProvider } from './src/services/authentication/authentication-persistence.provider';

@CoolModule({
  imports: [
    AuthenticationModule.forRoot({
      persistenceProvider: MyAuthenticationPersistenceProvider,
      configuration: {
        google: {
          enabled: true,
        },
      },
    })
  ],
})
export class ServerModule {}
```

#### Continue reading: [ Authenticate >>](/authentication/authenticate.md) <!-- {docsify-ignore} -->