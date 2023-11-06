import { array, isNil, isString, isValid } from '@visactor/vutils';
import type { IBaseInteractionOptions, IGrammarBase, IView, InteractionEventHandler } from '../types';

export abstract class BaseInteraction<T extends IBaseInteractionOptions> {
  readonly view: IView;

  constructor(view: IView, options: T) {
    this.view = view;
    this.depend(options?.dependencies);
  }

  references: Map<IGrammarBase, number> = new Map();

  protected abstract getEvents(): Array<{ type: string; handler: InteractionEventHandler }>;

  depend(grammar: IGrammarBase[] | IGrammarBase | string[] | string) {
    this.references.clear();
    array(grammar)
      .map(grammar => (isString(grammar) ? this.view.getGrammarById(grammar) : grammar))
      .filter(ref => !isNil(ref))
      .forEach(ref => {
        this.references.set(ref, (this.references.get(ref) ?? 0) + 1);
      });
  }

  parameters() {
    const params: any = {};
    this.references.forEach((count, ref) => {
      // upstream reference with no valid id will not be recorded in parameters
      if (isValid(ref.id())) {
        params[ref.id() as string] = ref.output();
      }
    });
    return params;
  }

  bind() {
    const events = this.getEvents();

    (events ?? []).forEach(evt => {
      if (evt.type && evt.handler) {
        this.view.addEventListener(evt.type, evt.handler);
      }
    });
  }

  unbind() {
    // unbind events
    const events = this.getEvents();

    (events ?? []).forEach(evt => {
      if (evt.type && evt.handler) {
        this.view.removeEventListener(evt.type, evt.handler);
      }
    });
  }
}
