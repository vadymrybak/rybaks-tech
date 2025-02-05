import { injectable } from '@biorate/inversion';
import { observable, action, computed, makeObservable } from 'mobx';

@injectable()
export class Spinner {
  @observable public tags = new Set<string>();

  @computed public get visible() {
    return !!this.tags.size;
  }

  public constructor() {
    makeObservable(this);
  }

  @action public show(tag: string) {
    this.tags.add(tag);
  }

  @action public hide(tag: string) {
    this.tags.delete(tag);
  }
}
