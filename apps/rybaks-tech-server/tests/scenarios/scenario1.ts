import { step, Scenario } from '@biorate/mocha';

export class Scenario1 extends Scenario {
  @step()
  protected async step1() {
    this.ctx.set('a', 1);
  }

  @step()
  protected async step2() {
    this.ctx.set('b', 2);
  }
}
