import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { AABBBounds, array, getAngleByPoint, isString, throttle } from '@visactor/vutils';
import type { DimensionTooltipOptions, IElement, IGroupMark, IMark, IView, TooltipType } from '../types';
import { BaseTooltip } from './base-tooltip';
// eslint-disable-next-line no-duplicate-imports
import { generateTooltipAttributes } from './base-tooltip';
import { BridgeElementKey } from '../graph/constants';
import type { IBaseScale } from '@visactor/vscale';
import { invokeFunctionType } from '../parse/util';

const isEqualTooltipDatum = (current: any[], previous: any[]) => {
  const currentDatum = array(current);
  const previousDatum = array(previous);
  if (currentDatum.length !== previousDatum.length) {
    return false;
  }
  return (
    currentDatum.every(datum => previousDatum.includes(datum)) &&
    previousDatum.every(datum => currentDatum.includes(datum))
  );
};

const computeTooltipFilterValue = (
  point: IPointLike,
  scale: IBaseScale,
  type: TooltipType,
  groupSize: { width: number; height: number },
  tooltipCenter?: IPointLike
) => {
  if (type === 'x') {
    return scale.invert(point.x);
  }
  if (type === 'y') {
    return scale.invert(point.y);
  }
  if (type === 'radius') {
    const center = tooltipCenter ?? { x: groupSize.width / 2, y: groupSize.height / 2 };
    const radius = Math.sqrt((center.x - point.x) ** 2 + (center.y - point.y) ** 2);
    return scale.invert(radius);
  }
  if (type === 'angle') {
    const center = tooltipCenter ?? { x: groupSize.width / 2, y: groupSize.height / 2 };
    const angle = getAngleByPoint(center, point);
    return scale.invert(angle < 0 ? angle + Math.PI * 2 : angle);
  }
  return scale.invert(point.x);
};

export class DimensionTooltip extends BaseTooltip<DimensionTooltipOptions> {
  static type: string = 'dimension-tooltip';
  type: string = DimensionTooltip.type;

  static defaultOptions: Omit<DimensionTooltipOptions, 'target'> = {
    trigger: 'pointermove',
    resetTrigger: 'pointerleave'
  };
  protected _avoidMarks: IMark[] = [];
  protected _lastDatum: any;
  protected _tooltipDataFilter: ((datum: any, filterValue: any[]) => boolean) | null = null;
  protected _container: IGroupMark;

  constructor(view: IView, options?: DimensionTooltipOptions) {
    super(view, options);
    this.options = Object.assign({}, DimensionTooltip.defaultOptions, options);
    this._marks = view.getMarksBySelector(this.options.selector);
    this._avoidMarks = view.getMarksBySelector(this.options.avoidMark) ?? [];
    this._container = (view.getMarksBySelector(this.options.container)?.[0] as IGroupMark) ?? view.rootMark;
  }

  protected getEvents() {
    const filter = this.options.target.filter;

    this._tooltipDataFilter = isString(filter)
      ? (datum: any, filterValue: any[]) => filterValue === datum[filter]
      : filter;

    return {
      [this.options.trigger]: this.handleTooltipShow,
      [this.options.resetTrigger]: this.handleTooltipHide
    };
  }

  protected handleTooltipShow = throttle((event: any, element: IElement) => {
    const scaleGrammar = isString(this.options.scale) ? this.view.getScaleById(this.options.scale) : this.options.scale;
    const scale = scaleGrammar.getScale();
    const groupGraphicItem = this._container.getGroupGraphicItem();
    // FIXME: waiting for vRender to add transformed position to event
    const point = { x: 0, y: 0 };
    groupGraphicItem.globalTransMatrix.transformPoint(event.canvas, point);
    const groupSize = { width: groupGraphicItem.attribute.width, height: groupGraphicItem.attribute.height };

    // if pointer is not within the area of group, hide tooltip
    if (
      point.x < 0 ||
      point.x > groupGraphicItem.attribute.width ||
      point.y < 0 ||
      point.y > groupGraphicItem.attribute.height
    ) {
      this._tooltipComponent.hideAll();
      return;
    }
    // if pointer is hovered on the avoided marks, hide tooltip
    const eventTargetMark = event.target?.[BridgeElementKey]?.mark;
    if (this._avoidMarks.includes(eventTargetMark)) {
      this._tooltipComponent.hideAll();
      return;
    }

    const target = this.options.target?.data;
    const lastDataGrammar = !target ? null : isString(target) ? this.view.getDataById(target) : target;
    const data = lastDataGrammar ? lastDataGrammar.getValue() : [];

    const filterValue = computeTooltipFilterValue(
      point,
      scale,
      this.options.tooltipType,
      groupSize,
      this.options.center
    );
    const tooltipDatum = this._tooltipDataFilter
      ? data.filter(datum => this._tooltipDataFilter(datum, filterValue))
      : [];

    this._tooltipComponent.showAll();
    if (isEqualTooltipDatum(tooltipDatum, this._lastDatum)) {
      // only update pointer when element is not changed
      this._tooltipComponent.setAttributes({ pointerX: point.x, pointerY: point.y } as any);
      return;
    }
    this._lastDatum = tooltipDatum;

    // compute tooltip bounds
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
    const { title, content } = this._computeTitleContent(tooltipDatum);
    const theme = this.view.getCurrentTheme();
    const addition = invokeFunctionType(this.options.attributes, {}, {}) as any;
    const attributes = generateTooltipAttributes(point, title, content, bounds, theme, addition);
    this._tooltipComponent.setAttributes(attributes);
  }, 10);

  protected handleTooltipHide = (event: any) => {
    this._tooltipComponent.hideAll();
  };
}
