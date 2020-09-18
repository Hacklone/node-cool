# Query database

There are 2 ways of querying your database with [TypeORM](https://typeorm.io). A simplistic way using Find API and a more advanced way using the Query Builder API.

## Query using Find API

``` typescript
import { Injectable } from '@node-cool/core';
import { DatabaseConnection } from '@node-cool/database';

import { ExampleEntity } from './../../entities/example.entity';

@Injectable()
export class ExampleService {
  constructor(private _databaseConnection: DatabaseConnection) {}

  public async getExampleByIdAsync(exampleId: string): Promise<ExampleEntity | undefined> {
    return await this._databaseConnection.getRepository(ExampleEntity).findOne({
      relations: ['user'],
      where: {
        id: exampleId,
      },
    });
  }
}
```

[Read advanced way of querying database with Find API](https://typeorm.io/#/find-options)

## Query using Query Builder API

```typescript
import { Injectable } from '@node-cool/core';
import { DatabaseConnection } from '@node-cool/database';

import { ExampleEntity } from './../../entities/example.entity';

@Injectable()
export class ExampleService {
  constructor(private _databaseConnection: DatabaseConnection) {}

  public async getExampleByIdAsync(exampleId: string): Promise<ExampleEntity | undefined> {
    return await this._databaseConnection.getRepositoryQueryBuilder(ExampleEntity, 'example')
      .innerJoinAndSelect('example.user', 'user')
      .andWhere('example.id = :exampleId', { exampleId: exampleId })
      .getOne();
  }
}
```

[Read advanced ways of querying database with Query Builder API](https://typeorm.io/#/select-query-builder)