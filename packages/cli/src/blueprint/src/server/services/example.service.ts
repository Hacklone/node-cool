import { Injectable } from '@node-cool/core';
import { DatabaseConnection } from '@node-cool/database';

import { ExampleEntity } from './../../entities/example.entity';

@Injectable()
export class ExampleService {
  constructor(private _databaseConnection: DatabaseConnection) {}

  public async getExampleByIdAsync(exampleId: string): Promise<ExampleEntity> {
    return await this._databaseConnection.getRepository(ExampleEntity).findOne({
      where: {
        id: exampleId,
      },
    });
  }
}
