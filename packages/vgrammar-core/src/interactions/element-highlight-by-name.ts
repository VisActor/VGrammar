import { InteractionStateEnum } from '../graph/enums';
import type { ElementHighlightByNameOptions, IElement, IGlyphElement, IMark, IView, InteractionEvent } from '../types';
import { BaseInteraction } from './base';
import { array, isNil } from '@visactor/vutils';
import { generateFilterValue } from './utils';

export class ElementHighlightByName extends BaseInteraction<ElementHighlightByNameOptions> {
  static type: string = 'element-highlight-by-name';
  type: string = ElementHighlightByName.type;

  static defaultOptions: ElementHighlightByNameOptions = {
    trigger: 'pointerover',
    triggerOff: 'pointerout',
    highlightState: InteractionStateEnum.highlight,
    blurState: InteractionStateEnum.blur,
    filterType: 'groupKey'
  };
  options: ElementHighlightByNameOptions;
  protected _marks?: IMark[];

  constructor(view: IView, options?: ElementHighlightByNameOptions) {
    super(view, options);
    this.options = Object.assign({}, ElementHighlightByName.defaultOptions, options);

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

  protected _filterByName(e: InteractionEvent) {
    const names = array(this.options.graphicName);
    return e?.target?.name && names.includes(e.target.name);
  }

  protected _parseTargetKey(e: InteractionEvent, element: IElement | IGlyphElement) {
    return this.options.parseData
      ? this.options.parseData(e)
      : e.target.type === 'text'
      ? (e.target.attribute as any).text
      : null;
  }

  start(itemKey: IElement | IGlyphElement | string) {
    if (isNil(itemKey)) {
      return;
    }

    const filterValue = generateFilterValue(this.options);

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        const isHighlight = filterValue(el) === itemKey;
        if (isHighlight) {
          el.updateStates({
            [this.options.blurState]: false,
            [this.options.highlightState]: true
          });
        } else {
          el.updateStates({
            [this.options.blurState]: true,
            [this.options.highlightState]: false
          });
        }
      });
    });
  }

  resetAll() {
    const states = [this.options.blurState, this.options.highlightState];

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        el.removeState(states);
      });
    });
  }

  reset(element?: InteractionEvent['element']) {
    if (element) {
      if (this._marks && this._marks.includes(element.mark)) {
        element.removeState([this.options.highlightState, this.options.blurState]);
      }
    } else {
      this.resetAll();
    }
  }

  handleStart = (e: InteractionEvent, element: IElement | IGlyphElement) => {
    const shoudStart = this.options.shouldStart ? this.options.shouldStart(e) : this._filterByName(e);
    if (shoudStart) {
      const itemKey = this._parseTargetKey(e, element);
      this.start(itemKey);
    }
  };

  handleReset = (e: InteractionEvent) => {
    const shoudReset = this.options.shouldReset ? this.options.shouldReset(e) : this._filterByName(e);

    if (shoudReset) {
      this.resetAll();
    }
  };
}
