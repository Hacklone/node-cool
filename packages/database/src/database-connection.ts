import { Injectable } from 'injection-js';
import {
  Connection,
  createConnection,
  EntityManager,
  EntitySchema,
  getConnectionOptions,
  ObjectType,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export class DatabaseConnection {
  private _connection: Connection | undefined;

  public async connectAsync(): Promise<void> {
    const connectionOptions = await getConnectionOptions();

    this._connection = await createConnection(connectionOptions);
  }

  public getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity>): Repository<Entity> {
    if (!this._connection) {
      throw new Error('Not connected to database');
    }

    return this._connection.manager.getRepository<Entity>(target);
  }

  public getRepositoryQueryBuilder<Entity>(target: ObjectType<Entity> | EntitySchema<Entity>, alias?: string): SelectQueryBuilder<Entity> {
    if (!this._connection) {
      throw new Error('Not connected to database');
    }

    return this.getRepository<Entity>(target).createQueryBuilder(alias);
  }

  public getQueryBuilder<Entity>(entityName: string, alias: string): SelectQueryBuilder<Entity> {
    if (!this._connection) {
      throw new Error('Not connected to database');
    }

    return this._connection.manager.createQueryBuilder<Entity>(entityName, alias);
  }

  public async transactionAsync<T>(runInTransaction: (entityManager: EntityManager) => Promise<T>): Promise<T> {
    if (!this._connection) {
      throw new Error('Not connected to database');
    }

    return await this._connection.manager.transaction<T>(runInTransaction);
  }

  public async disconnectAsync(): Promise<void> {
    if (!this._connection) {
      return;
    }

    await this._connection.close();
  }
}