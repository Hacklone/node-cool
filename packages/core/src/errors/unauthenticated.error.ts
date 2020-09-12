import { ApplicationError } from './application.error';
import { ErrorType } from './error-type.enum';
import { UNAUTHORIZED } from 'http-status-codes';

export class UnauthenticatedApplicationError extends ApplicationError {
  constructor() {
    super('Unauthenticated', ErrorType.Unauthenticated, UNAUTHORIZED);
  }
}
