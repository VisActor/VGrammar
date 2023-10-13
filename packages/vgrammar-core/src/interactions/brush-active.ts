import type { IPolygon } from '@visactor/vrender-core';
import { InteractionStateEnum } from '../graph/enums';
import type { BrushActiveOptions, IElement, IGlyphElement, IView } from '../types';
import { BrushBase } from './brush-base';
import { type IBounds } from '@visactor/vutils';

export class BrushActive extends BrushBase<BrushActiveOptions> {
  static type: string = 'brush-active';
  type: string = BrushActive.type;

  static defaultOptions: BrushActiveOptions = {
    state: InteractionStateEnum.active
  };

  constructor(view: IView, option?: BrushActiveOptions) {
    super(view, Object.assign({}, BrushActive.defaultOptions, option));
  }

  handleBrushUpdate = (options: {
    operateType: string;
    operateMask: IPolygon;
    operatedMaskAABBBounds: { [name: string]: IBounds };
  }) => {
    const elements: (IElement | IGlyphElement)[] = [];

    this._marks.forEach(mark => {
      mark.elements.forEach(el => {
        const isActive = this.isBrushContainGraphicItem(options.operateMask, el.getGraphicItem());

        if (isActive) {
          elements.push(el);
          el.addState(this.options.state);
        } else {
          el.removeState(this.options.state);
        }
      });
    });

    this.dispatchEvent(options, elements);
  };
}
