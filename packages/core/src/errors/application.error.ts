import { ErrorType } from './error-type.enum';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';

export class ApplicationError extends Error {
  public isApplicationError = true;

  constructor(
    message: string,
    public type: ErrorType = ErrorType.ApplicationError,
    public statusCode: number = INTERNAL_SERVER_ERROR,
    public innerError?: Error,
  ) {
    super(message);
  }
}
