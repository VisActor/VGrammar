import { AABBBounds, throttle } from '@visactor/vutils';
import type { IElement, IView, InteractionEvent, InteractionEventHandler, TooltipOptions } from '../types';
import { BaseTooltip, generateTooltipAttributes } from './base-tooltip';

export class Tooltip extends BaseTooltip<TooltipOptions> {
  static type: string = 'tooltip';
  type: string = Tooltip.type;

  static defaultOptions: Omit<TooltipOptions, 'target'> = {
    trigger: 'pointermove',
    resetTrigger: 'pointerleave'
  };
  protected _lastElement: IElement;

  constructor(view: IView, options?: TooltipOptions) {
    super(view, options);
    this.options = Object.assign({}, Tooltip.defaultOptions, options);
  }

  protected getEvents() {
    return {
      [this.options.trigger]: this.handleTooltipShow,
      [this.options.resetTrigger]: this.handleTooltipHide
    };
  }

  protected handleTooltipShow = throttle((event: InteractionEvent) => {
    const element = event.element;
    if (!this._marks.includes(element?.mark)) {
      this._tooltipComponent.hideAll();
      return;
    }

    this._tooltipComponent.showAll();

    const groupGraphicItem = this.view.rootMark.getGroupGraphicItem();
    // FIXME: waiting for vRender to add transformed position to event
    const point = { x: 0, y: 0 };
    groupGraphicItem.globalTransMatrix.transformPoint(event.canvas, point);

    if (element === this._lastElement) {
      // only update pointer when element is not changed
      this._tooltipComponent.setAttributes({ pointerX: point.x, pointerY: point.y } as any);
      return;
    }

    const boundsStart = { x: 0, y: 0 };
    groupGraphicItem.globalTransMatrix.transformPoint({ x: 0, y: 0 }, boundsStart);
    const boundsEnd = { x: 0, y: 0 };
    groupGraphicItem.globalTransMatrix.transformPoint(
      {
        x: this.view.getSignalById('width').getValue() as number,
        y: this.view.getSignalById('height').getValue() as number
      },
      boundsEnd
    );
    const bounds = new AABBBounds().set(boundsStart.x, boundsStart.y, boundsEnd.x, boundsEnd.y);
    const { title, content } = this._computeTitleContent(element.getDatum());
    const theme = this.view.getCurrentTheme();
    const addition = (this.options.attributes ?? {}) as any;
    const attributes = generateTooltipAttributes(point, title, content, bounds, theme, addition);
    this._tooltipComponent.setAttributes(attributes);
  }, 10) as unknown as InteractionEventHandler;

  protected handleTooltipHide = (event: any) => {
    this._tooltipComponent.hideAll();
  };
}
