import type { IBounds, IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import {
  AABBBounds,
  isValid,
  isObjectLike,
  throttle,
  array,
  isNil,
  isString,
  merge,
  getAngleByPoint,
  isFunction,
  isArray
} from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import type { IGraphic, IGroup } from '@visactor/vrender';
import type { TooltipAttributes, TooltipRowAttrs } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { Tooltip as TooltipComponent } from '@visactor/vrender-components';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import { registerComponent } from '../view/register-component';
import type {
  BaseSignleEncodeSpec,
  IData,
  IElement,
  IGrammarBase,
  IGroupMark,
  IMark,
  IScale,
  ITheme,
  IView,
  Nil,
  RecursivePartial,
  StateEncodeSpec
} from '../types';
import { ComponentEnum } from '../graph';
import type {
  BaseTooltipSpec,
  CustomTooltipCallback,
  DimensionTooltipSpec,
  IDimensionTooltip,
  ITooltip,
  ITooltipRow,
  TooltipSpec,
  TooltipType
} from '../types/component';
import { Component } from '../view/component';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType, parseFunctionType } from '../parse/util';
import { isFieldEncode } from '../parse/mark';
import { BridgeElementKey } from '../graph/constants';
import type { IBaseScale } from '@visactor/vscale';

registerComponent(
  ComponentEnum.tooltip,
  (attrs: TooltipAttributes) => new TooltipComponent(attrs) as unknown as IGraphic
);
registerComponent(
  ComponentEnum.dimensionTooltip,
  (attrs: TooltipAttributes) => new TooltipComponent(attrs) as unknown as IGraphic
);

export const generateTooltipAttributes = (
  point: IPointLike,
  title: TooltipRowAttrs,
  content: TooltipRowAttrs[],
  bounds: IBounds,
  theme?: ITheme,
  addition?: RecursivePartial<TooltipAttributes>
): TooltipAttributes => {
  const tooltipTheme = theme?.components?.tooltip;

  return merge(
    {},
    tooltipTheme,
    {
      visible: true,
      pointerX: point.x,
      pointerY: point.y,
      title,
      content,
      parentBounds: bounds
    },
    addition ?? {}
  );
};

export abstract class BaseTooltip extends Component {
  protected declare spec: BaseTooltipSpec;

  protected _additionalEncodeResult: any;

  protected parseAddition(spec: BaseTooltipSpec) {
    super.parseAddition(spec);
    this.title(spec.title);
    this.content(spec.content);
    return this;
  }

  title(title: ITooltipRow | string | CustomTooltipCallback | Nil) {
    if (this.spec.title && !isString(this.spec.title) && !isFunction(this.spec.title)) {
      this.detach(this._parseTooltipRow(this.spec.title));
    }
    this.spec.title = title;
    if (title && !isString(title) && !isFunction(title)) {
      this.attach(this._parseTooltipRow(title));
    }
    this.commit();
    return this;
  }

  content(content: ITooltipRow | ITooltipRow[] | CustomTooltipCallback | Nil) {
    if (this.spec.content && !isFunction(this.spec.content)) {
      this.detach(this._parseTooltipRow(this.spec.content));
    }
    this.spec.content = content;
    if (content && !isFunction(content)) {
      this.attach(this._parseTooltipRow(content));
    }
    this.commit();
    return this;
  }

  configureComponent(config: any) {
    super.configureComponent(config);
    return this;
  }

  protected _updateComponentEncoders() {
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            this._additionalEncodeResult = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }

  protected _parseTooltipRow(tooltipRow: ITooltipRow | ITooltipRow[] | Nil) {
    return array(tooltipRow).reduce((dependencies, row) => {
      dependencies = dependencies.concat(parseFunctionType(row.visible, this.view));
      if (!isFieldEncode(row.key)) {
        dependencies = dependencies.concat(parseFunctionType(row.key, this.view));
      }
      if (!isFieldEncode(row.value)) {
        dependencies = dependencies.concat(parseFunctionType(row.value, this.view));
      }
      if (!isFieldEncode(row.symbol)) {
        dependencies = dependencies.concat(parseFunctionType(row.symbol, this.view));
      }
      return dependencies;
    }, [] as IGrammarBase[]);
  }

  protected _computeTooltipRow(row: ITooltipRow, datum: any, parameters: any) {
    const element = this.elements[0];

    // compute visible
    let visible = invokeFunctionType(row.visible, parameters, datum, element);
    visible = isNil(visible) ? true : !!visible;

    // compute key
    let key;
    if (isFieldEncode(row.key)) {
      const fieldAccessor = getFieldAccessor(row.key.field);
      key = fieldAccessor(datum);
    } else {
      key = invokeFunctionType(row.key, parameters, datum, element);
    }
    key = isNil(key) ? undefined : isObjectLike(key) ? key : { text: key };

    // compute value
    let value;
    if (isFieldEncode(row.value)) {
      const fieldAccessor = getFieldAccessor(row.value.field);
      value = fieldAccessor(datum);
    } else {
      value = invokeFunctionType(row.value, parameters, datum, element);
    }
    value = isNil(value) ? undefined : isObjectLike(value) ? value : { text: value };

    // compute symbol
    let symbol;
    if (isFieldEncode(row.symbol)) {
      const fieldAccessor = getFieldAccessor(row.symbol.field);
      symbol = fieldAccessor(datum);
    } else {
      symbol = invokeFunctionType(row.symbol, parameters, datum, element);
    }
    symbol = isNil(symbol) ? undefined : isObjectLike(symbol) ? symbol : { symbolType: symbol };

    return { visible, key, value, shape: symbol };
  }

  protected _computeTitleContent(datum: any) {
    const tooltip = this.elements[0];
    const parameters = this.parameters();

    const title = isValid(this.spec.title)
      ? isFunction(this.spec.title)
        ? this.spec.title.call(null, datum, tooltip, parameters)
        : this._computeTooltipRow(
            isString(this.spec.title) ? { value: this.spec.title } : this.spec.title,
            datum,
            parameters
          )
      : undefined;
    const content = isValid(this.spec.content)
      ? isFunction(this.spec.content)
        ? array(this.spec.content.call(null, datum, tooltip, parameters))
        : array(datum).reduce((content, datumRow) => {
            return content.concat(
              array(this.spec.content).map(row => this._computeTooltipRow(row as ITooltipRow, datumRow, parameters))
            );
          }, [])
      : undefined;

    // only display one single row in title
    return { title: isArray(title) ? title[0] : title, content };
  }
}

export class Tooltip extends BaseTooltip implements ITooltip {
  protected declare spec: TooltipSpec;

  private _targetMarks: IMark[] = [];
  private _lastElement: IElement;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.tooltip, group);
    this.spec.componentType = ComponentEnum.tooltip;
  }

  protected parseAddition(spec: TooltipSpec) {
    super.parseAddition(spec);
    this.target(spec.target);
    return this;
  }

  target(mark: IMark | IMark[] | string | string[] | Nil): this {
    if (this.spec.target) {
      const prevMarks = array(this.spec.target).map(m => (isString(m) ? this.view.getMarkById(m) : m));
      this.detach(prevMarks);
    }
    this.spec.target = mark;
    const nextMarks = array(mark).map(m => (isString(m) ? this.view.getMarkById(m) : m));
    this.attach(nextMarks);
    this._targetMarks = nextMarks.filter(m => !isNil(m));
    this.commit();
    return this;
  }

  release() {
    this.view.removeEventListener('pointermove', this._onTooltipShow);
    this.view.removeEventListener('pointerleave', this._onTooltipHide);
    super.release();
  }

  protected init(stage: any, parameters: any) {
    super.init(stage, parameters);
    this.view.addEventListener('pointermove', this._onTooltipShow);
    this.view.addEventListener('pointerleave', this._onTooltipHide);
  }

  protected _onTooltipShow = throttle((event: any, element: IElement) => {
    const tooltip = this.elements[0].getGraphicItem() as IGroup;
    if (!this._targetMarks.includes(element?.mark)) {
      tooltip.hideAll();
      return;
    }

    tooltip.showAll();

    const groupGraphicItem = this.group.getGroupGraphicItem();
    // FIXME: waiting for vRender to add transformed position to event
    const point = { x: 0, y: 0 };
    groupGraphicItem.globalTransMatrix.transformPoint(event.canvas, point);

    if (element === this._lastElement) {
      // only update pointer when element is not changed
      tooltip.setAttributes({ pointerX: point.x, pointerY: point.y } as any);
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
    const attributes = generateTooltipAttributes(point, title, content, bounds, theme, this._additionalEncodeResult);
    tooltip.setAttributes(attributes);
  }, 10);

  protected _onTooltipHide = (event: any) => {
    const tooltip = this.elements[0].getGraphicItem() as IGroup;
    tooltip.hideAll();
  };
}

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
  config: DimensionTooltipSpec['componentConfig']
) => {
  if (type === 'x') {
    return scale.invert(point.x);
  }
  if (type === 'y') {
    return scale.invert(point.y);
  }
  if (type === 'radius') {
    const center = config?.center ?? { x: groupSize.width / 2, y: groupSize.height / 2 };
    const radius = Math.sqrt((center.x - point.x) ** 2 + (center.y - point.y) ** 2);
    return scale.invert(radius);
  }
  if (type === 'angle') {
    const center = config?.center ?? { x: groupSize.width / 2, y: groupSize.height / 2 };
    const angle = getAngleByPoint(center, point);
    return scale.invert(angle);
  }
  return scale.invert(point.x);
};

export class DimensionTooltip extends BaseTooltip implements IDimensionTooltip {
  protected declare spec: DimensionTooltipSpec;

  private _lastGroup: IGroup;
  private _lastDatum: any;
  private _avoidMarks: IMark[] = [];
  private _tooltipDataFilter: ((datum: any, filterValue: any[]) => boolean) | null = null;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.dimensionTooltip, group);
    this.spec.componentType = ComponentEnum.dimensionTooltip;
    this.spec.tooltipType = 'x';
  }

  protected parseAddition(spec: DimensionTooltipSpec) {
    super.parseAddition(spec);
    this.scale(spec.scale);
    this.tooltipType(spec.tooltipType);
    this.target(spec.target?.data, spec.target?.filter);
    this.avoidMark(spec.avoidMark);
    return this;
  }

  scale(scale?: IScale | string | Nil) {
    if (this.spec.scale) {
      const lastScaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
      this.detach(lastScaleGrammar);
      this.spec.scale = undefined;
    }
    const scaleGrammar = isString(scale) ? this.view.getScaleById(scale) : scale;
    this.spec.scale = scaleGrammar;
    this.attach(scaleGrammar);
    this.commit();
    return this;
  }

  tooltipType(tooltipType: TooltipType | Nil) {
    this.spec.tooltipType = tooltipType;
    this.commit();
    return this;
  }

  target(data: IData | string | Nil, filter: string | ((datum: any, tooltipValue: any) => boolean) | Nil) {
    const lastData = this.spec.target?.data;
    if (lastData) {
      const lastDataGrammar = isString(lastData) ? this.view.getDataById(lastData) : lastData;
      this.detach(lastDataGrammar);
      this.spec.target = undefined;
    }
    const dataGrammar = isString(data) ? this.view.getDataById(data) : data;
    this._tooltipDataFilter = isString(filter)
      ? (datum: any, filterValue: any[]) => filterValue === datum[filter]
      : filter;
    if (dataGrammar) {
      this.attach(dataGrammar);
      this.spec.target = { data: dataGrammar, filter };
    }
    this.commit();
    return this;
  }

  avoidMark(mark: IMark | IMark[] | string | string[] | Nil) {
    if (this.spec.avoidMark) {
      const prevMarks = array(this.spec.avoidMark).map(m => (isString(m) ? this.view.getMarkById(m) : m));
      this.detach(prevMarks);
    }
    this.spec.avoidMark = mark;
    const nextMarks = array(mark).map(m => (isString(m) ? this.view.getMarkById(m) : m));
    this.attach(nextMarks);
    this._avoidMarks = nextMarks.filter(m => !isNil(m));
    this.commit();
    return this;
  }

  release() {
    (this._lastGroup as any)?.off?.('pointermove', this._onTooltipShow);
    (this._lastGroup as any)?.off?.('pointerleave', this._onTooltipHide);
    super.release();
  }

  protected init(stage: any, parameters: any) {
    super.init(stage, parameters);

    const groupGraphicItem = this.group ? this.group.getGroupGraphicItem() : stage.defaultLayer;
    if (this._lastGroup !== groupGraphicItem) {
      // FIXME: waiting for vRender to fix
      (this._lastGroup as any)?.off?.('pointermove', this._onTooltipShow);
      (this._lastGroup as any)?.off?.('pointerleave', this._onTooltipHide);
    }
    groupGraphicItem?.on?.('pointermove', this._onTooltipShow);
    groupGraphicItem?.on?.('pointerleave', this._onTooltipHide);
    this._lastGroup = groupGraphicItem;
  }

  protected _onTooltipShow = throttle((event: any, element: IElement) => {
    const tooltip = this.elements[0].getGraphicItem() as IGroup;

    const scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
    const scale = scaleGrammar.getScale();
    const groupGraphicItem = this.group.getGroupGraphicItem();
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
      tooltip.hideAll();
      return;
    }
    // if pointer is hovered on the avoided marks, hide tooltip
    const eventTargetMark = event.target?.[BridgeElementKey]?.mark;
    if (this._avoidMarks.includes(eventTargetMark)) {
      tooltip.hideAll();
      return;
    }

    const target = this.spec.target?.data;
    const lastDataGrammar = !target ? null : isString(target) ? this.view.getDataById(target) : target;
    const data = lastDataGrammar ? lastDataGrammar.getValue() : [];

    const filterValue = computeTooltipFilterValue(
      point,
      scale,
      this.spec.tooltipType,
      groupSize,
      this.spec.componentConfig
    );
    const tooltipDatum = this._tooltipDataFilter
      ? data.filter(datum => this._tooltipDataFilter(datum, filterValue))
      : [];

    tooltip.showAll();
    if (isEqualTooltipDatum(tooltipDatum, this._lastDatum)) {
      // only update pointer when element is not changed
      tooltip.setAttributes({ pointerX: point.x, pointerY: point.y } as any);
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
    const attributes = generateTooltipAttributes(point, title, content, bounds, theme, this._additionalEncodeResult);
    tooltip.setAttributes(attributes);
  }, 10);

  protected _onTooltipHide = (event: any) => {
    const tooltip = this.elements[0].getGraphicItem() as IGroup;
    tooltip.hideAll();
  };
}
