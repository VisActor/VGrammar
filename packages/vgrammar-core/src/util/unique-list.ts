import { identity } from '@visactor/vgrammar-util';

export class UniqueList<T> {
  private idFunc: (val: T) => number;

  private list: T[] = [];

  private ids: Record<string, number> = {};

  constructor(idFunc: (val: T) => number) {
    this.idFunc = idFunc || identity;
  }

  add(element: T) {
    const id = this.idFunc(element);

    if (!this.ids[id]) {
      this.ids[id] = 1;
      this.list.push(element);
    }
    return this;
  }

  remove(element: T) {
    const id = this.idFunc(element);

    if (this.ids[id]) {
      this.ids[id] = 0;
      this.list = this.list.filter(entry => entry !== element);
    }
    return this;
  }

  forEach(callback: (entry: T, index?: number, arr?: T[]) => void, reverse?: boolean) {
    if (reverse) {
      this.list.slice().reverse().forEach(callback);
    } else {
      this.list.forEach(callback);
    }
  }

  filter(callback: (entry: T, index?: number, arr?: T[]) => boolean) {
    return this.list.filter(callback);
  }

  public get length() {
    return this.list.length;
  }

  getElementByIndex(index: number) {
    return this.list[index];
  }
}
