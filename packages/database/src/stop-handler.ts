import { DatabaseConnection } from './database-connection';
import { StopHandler, Inject, Logger, LOGGER } from '@node-cool/core';

export class ServerStopHandler implements StopHandler {
  constructor(private _databaseConnection: DatabaseConnection, @Inject(LOGGER) private _logger: Logger) {}

  public async onStopAsync(): Promise<void> {
    this._logger.verbose('Disconnecting from database');

    await this._databaseConnection.disconnectAsync();

    this._logger.verbose('Disconnected from database');
  }
}
