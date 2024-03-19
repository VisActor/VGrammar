import { array, isArray, isNil, isString, isValid } from '@visactor/vutils';
import type {
  IBaseInteractionOptions,
  IElement,
  IGlyphElement,
  IGrammarBase,
  IView,
  InteractionEventHandler
} from '../types';

export abstract class BaseInteraction<T extends IBaseInteractionOptions> {
  readonly view: IView;

  options: T;

  type: string;

  constructor(view: IView, options: T) {
    this.view = view;
    this.depend(options?.dependency);
  }

  references: Map<IGrammarBase, number> = new Map();

  protected abstract getEvents(): Array<{ type: string | string[]; handler: InteractionEventHandler }>;

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
        if (isArray(evt.type)) {
          evt.type.forEach(evtType => {
            evtType && evtType !== 'none' && this.view.addEventListener(evtType, evt.handler);
          });
        } else {
          evt.type !== 'none' && this.view.addEventListener(evt.type, evt.handler);
        }
      }
    });
  }

  unbind() {
    // unbind events
    const events = this.getEvents();

    (events ?? []).forEach(evt => {
      if (evt.type && evt.handler) {
        if (isArray(evt.type)) {
          evt.type.forEach(evtType => {
            evtType && evtType !== 'none' && this.view.removeEventListener(evtType, evt.handler);
          });
        } else {
          evt.type !== 'none' && this.view.removeEventListener(evt.type, evt.handler);
        }
      }
    });
  }

  start(element: IElement | IGlyphElement) {
    // do  nothing
  }

  reset(element?: IElement | IGlyphElement) {
    // do  nothing
  }

  protected dispatchEvent(type: 'start' | 'reset' | 'update' | 'end', params: any) {
    this.view.emit(`${this.type}:${type}`, params);

    if (type === 'start' && this.options.onStart) {
      this.options.onStart(params);
    } else if (type === 'reset' && this.options.onReset) {
      this.options.onReset(params);
    } else if (type === 'update' && this.options.onUpdate) {
      this.options.onUpdate(params);
    } else if (type === 'end' && this.options.onEnd) {
      this.options.onEnd(params);
    }
  }
}
