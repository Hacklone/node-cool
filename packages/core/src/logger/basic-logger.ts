import { Logger } from './logger.interface';
import { Injectable } from 'injection-js';

@Injectable()
export class BasicLogger implements Logger {
  public verbose(message: string, data?: unknown): void {
    console.log(`${ this._getTimeText() } ${ message }`);

    if (data) {
      console.log(data);
    }
  }

  public info(message: string, data?: unknown): void {
    console.info(`${ this._getTimeText() } ${ message }`);

    if (data) {
      console.log(data);
    }
  }

  public error(error: Error, data?: unknown): void {
    console.error(`${ this._getTimeText() } ${ error.message }`);

    console.error(error);

    if (data) {
      console.log(data);
    }
  }

  private _getTimeText(): string {
    return new Date().toJSON();
  }
}