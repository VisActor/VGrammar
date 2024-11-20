import { isArray } from '@visactor/vutils';
import { InteractionStateEnum } from '../graph/enums';
import type {
  ElementSelectOptions,
  EventType,
  IElement,
  IGlyphElement,
  IMark,
  IToggleStateMixin,
  IView,
  InteractionEvent
} from '../types';
import { groupMarksByState, parseTriggerOffOfSelect } from './utils';
import { BaseInteraction } from './base';

export interface ElementSelect extends IToggleStateMixin, BaseInteraction<ElementSelectOptions> {}

export class ElementSelect extends BaseInteraction<ElementSelectOptions> {
  static type: string = 'element-select';
  type: string = ElementSelect.type;

  static defaultOptions: ElementSelectOptions = {
    state: InteractionStateEnum.selected,
    trigger: 'click'
  };
  protected _resetType: ('view' | 'self' | 'timeout')[] = [];
  protected _marks?: IMark[];
  protected _stateMarks: Record<string, IMark[]>;
  private _timer?: number;
  protected _statedElements?: (IElement | IGlyphElement)[];

  constructor(view: IView, options?: ElementSelectOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementSelect.defaultOptions, options);

    this._marks = view.getMarksBySelector(this.options.selector);
    this._stateMarks = groupMarksByState(this._marks, [this.options.state, this.options.reverseState]);
  }

  getStartState(): string {
    return this.options.state;
  }

  protected getEvents() {
    const triggerOff = this.options.triggerOff;
    const trigger = this.options.trigger;

    const events = [
      {
        type: trigger,
        handler: this.handleStart
      }
    ];

    const { eventNames, resetType } = parseTriggerOffOfSelect(triggerOff);

    eventNames.forEach(evt => {
      if (evt && (isArray(trigger) ? !trigger.includes(evt) : evt !== trigger)) {
        events.push({ type: evt as EventType, handler: this.handleReset });
      }
    });

    this._resetType = resetType;

    return events;
  }

  resetAll = () => {
    const { state, reverseState } = this.options;

    if (this._statedElements && this._statedElements.length) {
      this.clearAllStates(state, reverseState);
      this.dispatchEvent('reset', { elements: this._statedElements, options: this.options });

      this._statedElements = [];
    }
  };

  handleStart = (e: InteractionEvent) => {
    this.start(e.element);
  };

  handleReset = (e: InteractionEvent) => {
    if (!this._statedElements || !this._statedElements.length) {
      return;
    }
    const element = e.element;
    const hasActiveElement = element && this._marks && this._marks.includes(element.mark);

    if (this._resetType.includes('view') && !hasActiveElement) {
      this.resetAll();
    } else if (this._resetType.includes('self') && hasActiveElement) {
      this.resetAll();
    }
  };

  start(element: InteractionEvent['element']) {
    const { state, reverseState, isMultiple } = this.options;
    if (element && this._marks && this._marks.includes(element.mark)) {
      if (element.hasState(state)) {
        if (this._resetType.includes('self')) {
          const newStatedElements = this._statedElements && this._statedElements.filter(el => el !== element);

          if (newStatedElements && newStatedElements.length) {
            this._statedElements = this.updateStates(newStatedElements, this._statedElements, state, reverseState);
          } else {
            this.resetAll();
          }
        }
      } else {
        if (this._timer) {
          clearTimeout(this._timer);
        }
        element.addState(state);

        this._statedElements = this.updateStates(
          isMultiple && this._statedElements ? [...this._statedElements, element] : [element],
          this._statedElements,
          state,
          reverseState
        );
        this.dispatchEvent('start', { elements: this._statedElements, options: this.options });

        if (this._resetType.includes('timeout')) {
          this._timer = setTimeout(() => {
            this.resetAll();
          }, this.options.triggerOff as number) as unknown as number;
        }
      }
    } else if (this._resetType.includes('view') && this._statedElements && this._statedElements.length) {
      this.resetAll();
    }
  }

  reset(element: InteractionEvent['element']) {
    if (element) {
      if (this._marks && this._marks.includes(element.mark)) {
        element.removeState([this.options.state, this.options.reverseState]);
      }
    } else {
      this.resetAll();
    }
  }
}
