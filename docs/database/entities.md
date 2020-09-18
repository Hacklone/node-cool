# Entities

## 1. Add new entity

``` typescript
// ./src/entities/my-new.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from '@node-cool/database';

@Entity()
export class ExampleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: string;

  @Column()
  public name: string;
}
```

## 2. Generate migration script

``` bash
$ npm run db-migration-generate
```

This will generate migration scripts to the migrations folder.

## 3. Run migration scripts on database

``` bash
$ npm run db-migrate
```

[Read advanced way of creating entities](https://typeorm.io/#/entities)

#### Continue reading: [ Query database >>](/database/query-database.md) <!-- {docsify-ignore} -->