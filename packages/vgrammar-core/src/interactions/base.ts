import { isArray } from '@visactor/vutils';
import type { IView, InteractionEventHandler } from '../types';

export abstract class BaseInteraction {
  readonly view: IView;

  constructor(view: IView) {
    this.view = view;
  }

  protected abstract getEvents(): Record<string, InteractionEventHandler | InteractionEventHandler[]>;

  bind() {
    const events = this.getEvents();

    Object.keys(events).forEach(key => {
      if (isArray(events[key])) {
        (events[key] as InteractionEventHandler[]).forEach(callback => {
          this.view.addEventListener(key, callback);
        });
      } else {
        this.view.addEventListener(key, events[key] as InteractionEventHandler);
      }
    });
  }

  unbind() {
    // unbind events
    const events = this.getEvents();

    Object.keys(events).forEach(key => {
      if (isArray(events[key])) {
        (events[key] as InteractionEventHandler[]).forEach(callback => {
          this.view.removeEventListener(key, callback);
        });
      } else {
        this.view.removeEventListener(key, events[key] as InteractionEventHandler);
      }
    });
  }
}
