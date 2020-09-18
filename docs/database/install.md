# Install

`@node-cool` uses [TypeORM](https://typeorm.io/) for ORM.

## 1. Install package

```bash
$ npm install --save @node-cool/database
```

## 2. Add DatabaseModule to your server module

```typescript
// ./src/server.module.ts

import { DatabaseModule } from '@node-cool/database';

@CoolModule({
  imports: [DatabaseModule],
})
export class ServerModule {}
```

## 3. Choose and install database engine

| Database                  | Install                         |
| ------------------------- | ------------------------------- |
| MySQL or MariaDB          | `$ npm install mysql2 --save`   |
| PostgreSQL or CockroachDB | `$ npm install pg --save`       |
| SQLite                    | `$ npm install sqlite3 --save`  |
| Microsoft SQL Server      | `$ npm install mssql --save`    |
| sql.js                    | `$ npm install sql.js --save`   |
| Oracle                    | `$ npm install oracledb --save` |
| MongoDB (experimental)    | `$ npm install mongodb --save`  |

Install only one of them, depending on which database you use.

[Read more](https://typeorm.io/#/connection-options)

## 4. Add ormconfig.js

```javascript
module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  synchronize: false,
  maxQueryExecutionTime: 1000,
  entities: [`${__dirname}/src/entities/**/*.js`],
  migrations: [`${__dirname}/src/migrations/**/*.js`],
  cli: {
    migrationsDir: `src/migrations`,
  },
};
```

Add database conntection string to `DATABASE_URL` environment variable.

[Read more on how to configure connection options](https://typeorm.io/#/connection-options)

## 5. Add scripts to package.json

```json
"scripts": {
  "db-migration-generate": "./node_modules/.bin/typeorm migration:generate -n Change",
  "db-migrate": "./node_modules/.bin/typeorm migration:run",
  "db-rollback": "./node_modules/.bin/typeorm migration:revert"
}
```

- Run `$ npm run db-migration-generate` to generate migration scripts. Be sure to check in these scripts to git.

- Run `$ npm run db-migrate` to execute migration scripts on database.

- Run `$ npm run db-rollback` to roll back executed migration script on database.

#### Continue reading: [ Add entity >>](/database/entities.md) <!-- {docsify-ignore} -->
