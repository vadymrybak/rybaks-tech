import { expect, Step, Scenario } from '@biorate/playwright';

export class Scenario2 extends Scenario {
  @Step('Some title of step1')
  protected async step1() {
    await this.page.goto('https://playwright.dev/');
  }

  @Step()
  protected async step2() {
    await expect(this.page).toHaveTitle(/Playwright/);
  }
}
