import { CustomError } from './CustomError';

export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to database';
  statusCode = 500;

  constructor() {
    super('Error connecting to database...');

    // necessary for extending builtin class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ];
  }
}