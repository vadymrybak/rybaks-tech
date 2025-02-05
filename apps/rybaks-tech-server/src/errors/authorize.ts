import { BaseError } from '@biorate/errors';

export class AuthorizationIncorrectLoginError extends BaseError {
  public constructor() {
    super('Incorrect login or password', undefined, { status: 401 });
  }
}

export class AuthorizationNotAuthorizedError extends BaseError {
  public constructor() {
    super('Not authorized', undefined, { status: 401 });
  }
}
