import { isNil } from '@visactor/vutils';
import type { ElementHighlightOptions, IMark, IView, InteractionEvent } from '../types';
import { InteractionStateEnum } from '../graph/enums';
import { BaseInteraction } from './base';

export class ElementHighlightByGroup extends BaseInteraction<ElementHighlightOptions> {
  static type: string = 'element-highlight-by-group';
  type: string = ElementHighlightByGroup.type;

  static defaultOptions: ElementHighlightOptions = {
    highlightState: InteractionStateEnum.highlight,
    blurState: InteractionStateEnum.blur,
    trigger: 'pointerover',
    triggerOff: 'pointerout'
  };
  options: ElementHighlightOptions;
  protected _marks?: IMark[];

  constructor(view: IView, options?: ElementHighlightOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementHighlightByGroup.defaultOptions, options);

    this._marks = view.getMarksBySelector(this.options.selector);
  }

  getStartState(): string {
    return this.options.highlightState;
  }

  protected getEvents() {
    return [
      {
        type: this.options.trigger,
        handler: this.handleStart
      },
      { type: this.options.triggerOff, handler: this.handleReset }
    ];
  }

  clearPrevElements() {
    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        el.removeState(this.options.highlightState);
        el.removeState(this.options.blurState);
      });
    });
  }

  start(element: InteractionEvent['element']) {
    if (element && this._marks && this._marks.includes(element.mark)) {
      const highlightKey = element.groupKey;

      if (isNil(highlightKey)) {
        return;
      }
      this._marks.forEach(mark => {
        mark.elements.forEach(el => {
          const isHighlight = el.groupKey === highlightKey;

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
  }

  reset(element: InteractionEvent['element']) {
    const hasActiveElement = element && this._marks && this._marks.includes(element.mark);

    if (hasActiveElement) {
      this.clearPrevElements();
    }
  }

  handleStart = (e: InteractionEvent) => {
    this.start(e.element);
  };

  handleReset = (e: InteractionEvent) => {
    this.reset(e.element);
  };
}
