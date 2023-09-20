import { isNil } from '@visactor/vutils';
import type { ElementHighlightOptions, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';
import { InteractionStateEnum } from '../graph/enums';

export class ElementHighlightByKey extends BaseInteraction {
  static type: string = 'element-highlight-by-key';
  type: string = ElementHighlightByKey.type;

  static defaultOptions: ElementHighlightOptions = {
    highlightState: InteractionStateEnum.highlight,
    blurState: InteractionStateEnum.blur,
    trigger: 'pointerover',
    resetTrigger: 'pointerout'
  };
  options: ElementHighlightOptions;
  private _marks?: IMark[];

  constructor(
    view: IView,
    option?: {
      selector?: string | string[];
      startTrigger?: string;
      endTrigger?: string;
      state?: string;
    }
  ) {
    super(view);
    this.options = Object.assign({}, ElementHighlightByKey.defaultOptions, option);

    this._marks = view.getMarksBySelector(this.options.selector);
  }

  protected getEvents() {
    const events = {
      [this.options.trigger]: this.handleStart,
      [this.options.resetTrigger]: this.handleReset
    };

    return events;
  }

  clearPrevElements() {
    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        if (el.hasState(this.options.highlightState)) {
          el.removeState(this.options.highlightState);
        }

        if (el.hasState(this.options.blurState)) {
          el.removeState(this.options.blurState);
        }
      });
    });
  }

  handleStart = (e: InteractionEvent) => {
    if (e.element && this._marks && this._marks.includes(e.element.mark)) {
      const highlightKey = e.element.key;

      if (isNil(highlightKey)) {
        return;
      }
      this._marks.forEach(mark => {
        mark.elements.forEach(el => {
          const isHighlight = el.key === highlightKey;

          if (isHighlight) {
            el.removeState(this.options.blurState);
            el.addState(this.options.highlightState);
          } else {
            el.removeState(this.options.highlightState);
            el.addState(this.options.blurState);
          }
        });
      });
    }
  };

  handleReset = (e: InteractionEvent) => {
    const hasActiveElement = e.element && this._marks && this._marks.includes(e.element.mark);

    if (hasActiveElement) {
      this.clearPrevElements();
    }
  };
}
