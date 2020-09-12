import { ApplicationError } from './application.error';
import { ErrorType } from './error-type.enum';
import { BAD_REQUEST } from 'http-status-codes';

export class BadParametersApplicationError extends ApplicationError {
  constructor(message = 'Bad parameters') {
    super(message, ErrorType.BadParameterApplicationError, BAD_REQUEST);
  }
}