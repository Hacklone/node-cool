import { ApplicationError } from './application.error';
import { ErrorType } from './error-type.enum';
import { NOT_FOUND } from 'http-status-codes';

export class NotFoundApplicationError extends ApplicationError {
  constructor(message = 'Not Found') {
    super(message, ErrorType.NotFoundApplicationError, NOT_FOUND);
  }
}
