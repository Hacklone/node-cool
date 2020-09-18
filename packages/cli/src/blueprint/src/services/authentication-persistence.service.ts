import { Injectable } from '@node-cool/core';
import { DatabaseConnection } from '@node-cool/database';
import { AuthenticationPersistenceProvider, AuthenticationType } from '@node-cool/authentication';

import { AuthenticationEntity } from '../entities/authentication.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class AuthenticationPersistenceService implements AuthenticationPersistenceProvider {
  constructor(private _databaseConnection: DatabaseConnection) {}

  public async getUserByAuthenticationIdAsync(
    authenticationType: AuthenticationType,
    authenticationId: string,
  ): Promise<{ id: string } | undefined | null> {
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
    await this._databaseConnection.getRepository(UserEntity).insert({
      name: userData.name,
      email: userData.email,
      profileImageUrl: userData.profileImageUrl || '',
    });

    await this._databaseConnection.getRepository(AuthenticationEntity).insert({
      authId: authenticationId,
      type: authenticationType,
    });
  }
}
