import { DatabaseConnection } from './database-connection';
import { StartHandler, LOGGER, Logger, Inject } from '@node-cool/core';

export class ServerStartHandler implements StartHandler {
  constructor(private _databaseConnection: DatabaseConnection, @Inject(LOGGER) private _logger: Logger) {}

  public async onStartAsync(): Promise<void> {
    this._logger.verbose('Connecting to database');

    await this._databaseConnection.connectAsync();

    this._logger.verbose('Connected to database');
  }
}
