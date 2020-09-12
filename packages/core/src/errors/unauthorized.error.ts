import { ApplicationError } from './application.error';
import { ErrorType } from './error-type.enum';
import { FORBIDDEN } from 'http-status-codes';

export class UnauthorizedApplicationError extends ApplicationError {
  constructor(message?: string) {
    super(`Unauthorized${message ? ' ' + message : ''}`, ErrorType.Unauthorized, FORBIDDEN);
  }
}
