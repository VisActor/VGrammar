import type { BaseEventHandler, IView } from '../types';

export abstract class BaseInteraction {
  readonly view: IView;

  constructor(view: IView) {
    this.view = view;
  }

  protected abstract getEvents(): Record<string, BaseEventHandler>;

  bind() {
    const events = this.getEvents();

    Object.keys(events).forEach(key => {
      this.view.addEventListener(key, events[key]);
    });
  }

  unbind() {
    // unbind events
    const events = this.getEvents();

    Object.keys(events).forEach(key => {
      this.view.removeEventListener(key, events[key]);
    });
  }
}