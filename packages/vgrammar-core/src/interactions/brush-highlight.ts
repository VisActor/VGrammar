import type { IPolygon } from '@visactor/vrender';
import { InteractionStateEnum } from '../graph/enums';
import type { BrushHighlightOptions, IElement, IGlyphElement, IView } from '../types';
import { BrushBase } from './brush-base';
import { type IBounds } from '@visactor/vutils';

export class BrushHighlight extends BrushBase<BrushHighlightOptions> {
  static type: string = 'brush-highlight';
  type: string = BrushHighlight.type;

  static defaultOptions: BrushHighlightOptions = {
    highlightState: InteractionStateEnum.highlight,
    blurState: InteractionStateEnum.blur
  };

  constructor(view: IView, option?: BrushHighlightOptions) {
    super(view, Object.assign({}, BrushHighlight.defaultOptions, option));
  }

  handleBrushUpdate = (options: {
    operateType: string;
    operateMask: IPolygon;
    operatedMaskAABBBounds: { [name: string]: IBounds };
  }) => {
    const elements: (IElement | IGlyphElement)[] = [];
    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        const isHighlight = this.isBrushContainGraphicItem(options.operateMask, el.getGraphicItem());

        if (isHighlight) {
          elements.push(el);
          el.removeState(this.options.blurState);
          el.addState(this.options.highlightState);
        } else {
          el.removeState(this.options.highlightState);
          el.addState(this.options.blurState);
        }
      });
    });

    this.dispatchEvent(options, elements);
  };
}
