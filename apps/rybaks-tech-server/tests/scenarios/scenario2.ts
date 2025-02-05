import { step, Scenario } from '@biorate/mocha';

export class Scenario2 extends Scenario {
  @step()
  protected async step1() {
    this.ctx.set('c', 3);
  }

  @step()
  protected async step2() {
    this.ctx.set('d', 4);
  }
}
