import { injectable } from '@biorate/inversion';
import { Test as BaseTest } from '../../src/test';

@injectable()
export class Test extends BaseTest {
  public echo() {
    return `${super.echo()} world!`;
  }
}
