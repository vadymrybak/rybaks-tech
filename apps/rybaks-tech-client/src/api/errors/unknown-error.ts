import { BaseError } from './base-error';
import { IError } from '../../interfaces';

export class UnknownError extends BaseError {
  public async process(e: IError) {}
}
