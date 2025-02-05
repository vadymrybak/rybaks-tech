import { injectable, init } from '@biorate/inversion';
import { observable, action, makeObservable } from 'mobx';
import { router, routes } from '../router';

@injectable()
export class Hello {
  @observable public counter = 1;

  public id = 1;

  public constructor() {
    makeObservable(this);
  }

  @action protected tick() {
    ++this.counter;
  }

  @action public async toBar() {
    await router.navigate(routes.bar(this.id++));
  }

  @init() protected initialize() {
    setInterval(() => this.tick(), 1000);
  }
}
