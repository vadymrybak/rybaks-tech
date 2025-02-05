import { expect, Step, Scenario } from '@biorate/playwright';

export class Scenario1 extends Scenario {
  @Step()
  protected async step1() {
    await this.page.goto('https://google.com/');
  }

  @Step()
  protected async step2() {
    await expect(this.page).toHaveTitle(/Google/);
  }
}
