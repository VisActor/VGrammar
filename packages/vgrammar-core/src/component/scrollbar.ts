import { isString, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender-core';
import type { Direction, OrientType, ScrollBarAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { ScrollBar as ScrollbarComponent } from '@visactor/vrender-components';
import type {
  BaseSignleEncodeSpec,
  IData,
  IElement,
  IGroupMark,
  ITheme,
  IView,
  MarkFunctionType,
  Nil,
  RecursivePartial,
  StateEncodeSpec
} from '../types';
import { DataFilterRank, ComponentEnum, GrammarMarkType } from '../graph';
import type { IScrollbar, ScrollbarFilterValue, ScrollbarSpec } from '../types/component';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType } from '../parse/util';
import { Factory } from '../core/factory';
import { ScaleComponent } from './scale';
import { registerScrollbarFilter } from '../interactions';

function isValidDirection(direction: Direction) {
  return direction === 'vertical' || direction === 'horizontal';
}

function isValidPosition(position: OrientType) {
  return position === 'top' || position === 'bottom' || position === 'left' || position === 'right';
}

function isHorizontalPosition(position: OrientType) {
  return position === 'top' || position === 'bottom';
}

export const generateScrollbarAttributes = (
  groupSize: { width: number; height: number },
  direction?: Direction,
  position?: OrientType,
  theme?: ITheme,
  addition?: RecursivePartial<ScrollBarAttributes>
): ScrollBarAttributes => {
  const scrollbarTheme = theme?.components?.scrollbar;

  let finalDirection: Direction = 'horizontal';
  let finalPosition: OrientType = 'bottom';
  if (!isValidDirection(direction) && !isValidPosition(position)) {
    finalDirection = 'horizontal';
    finalPosition = 'bottom';
  } else if (!isValidDirection(direction) && isValidPosition(position)) {
    finalDirection = isHorizontalPosition(position) ? 'horizontal' : 'vertical';
    finalPosition = position;
  } else if (isValidDirection(direction) && !isValidPosition(position)) {
    finalDirection = direction;
    finalPosition = direction === 'horizontal' ? 'bottom' : 'right';
  } else {
    finalDirection = direction;
    finalPosition =
      direction === 'horizontal' && !isHorizontalPosition(position)
        ? 'bottom'
        : direction === 'vertical' && isHorizontalPosition(position)
        ? 'right'
        : position;
  }

  const attributes: RecursivePartial<ScrollBarAttributes> = { direction: finalDirection };
  if (finalDirection === 'horizontal') {
    const size = addition.height ?? scrollbarTheme?.height ?? 12;

    // top or bottom
    if (finalPosition === 'top') {
      Object.assign(attributes, {
        width: groupSize.width,
        height: size,
        x: 0,
        y: 0
      });
    } else {
      Object.assign(attributes, {
        width: groupSize.width,
        height: size,
        x: 0,
        y: groupSize.height - size
      });
    }
  } else {
    const size = addition.width ?? scrollbarTheme?.width ?? 12;

    // left or right
    if (finalPosition === 'left') {
      Object.assign(attributes, {
        width: size,
        height: groupSize.height,
        x: 0,
        y: 0
      });
    } else {
      Object.assign(attributes, {
        width: size,
        height: groupSize.height,
        x: groupSize.width - size,
        y: 0
      });
    }
  }

  return merge({}, scrollbarTheme, attributes, addition ?? {});
};

export class Scrollbar extends ScaleComponent implements IScrollbar {
  static readonly componentType: string = ComponentEnum.scrollbar;
  protected declare spec: ScrollbarSpec;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.scrollbar, group);
    this.spec.componentType = ComponentEnum.scrollbar;
  }

  protected parseAddition(spec: ScrollbarSpec) {
    super.parseAddition(spec);
    this.target(spec.target?.data, spec.target?.filter);
    this.container(spec.container);
    this.direction(spec.direction);
    this.position(spec.position);
    return this;
  }

  target(data: IData | string | Nil, filter: string | ((datum: any, value: ScrollbarFilterValue) => boolean) | Nil) {
    const lastData = this.spec.target?.data;
    const lastDataGrammar = isString(lastData) ? this.view.getDataById(lastData) : lastData;
    if (lastDataGrammar) {
      this.view.removeEventListener('scroll', this._filterCallback);
    }
    this.spec.target = undefined;
    const dataGrammar = isString(data) ? this.view.getDataById(data) : data;
    const getFilterValue = (event: any) => {
      if (isString(filter)) {
        const range = event.detail.value;
        const scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
        if (scaleGrammar) {
          const scale = scaleGrammar.getScale();
          const scaleRange = scale.range();
          const start = scale.invert(range[0] * (scaleRange[1] - scaleRange[0]) + scaleRange[0]);
          const end = scale.invert(range[1] * (scaleRange[1] - scaleRange[0]) + scaleRange[0]);
          return { start, end, startRatio: range[0], endRatio: range[1] };
        }
        return { startRatio: range[0], endRatio: range[1] };
      }
      return { startRatio: event.detail.value[0], endRatio: event.detail.value[1] };
    };
    const dataFilter = isString(filter)
      ? (datum: any, filterValue: ScrollbarFilterValue) => {
          const scaleGrammar = isString(this.spec.scale) ? this.view.getScaleById(this.spec.scale) : this.spec.scale;
          const scale = scaleGrammar.getScale();
          const range = scale.range();
          const datumRatio = (scale.scale(datum[filter]) - range[0]) / (range[range.length - 1] - range[0]);
          return filterValue.startRatio <= datumRatio && filterValue.endRatio >= datumRatio;
        }
      : filter;
    this._filterData(lastDataGrammar, dataGrammar, DataFilterRank.scrollbar, getFilterValue, dataFilter);
    if (dataGrammar) {
      this.view.addEventListener('scroll', this._filterCallback);
      this.spec.target = { data: dataGrammar, filter };
    }
    return this;
  }

  container(container: IGroupMark | string | Nil): this {
    if (this.spec.container) {
      const prevContainer = isString(this.spec.container)
        ? this.view.getMarkById(this.spec.container)
        : this.spec.container;
      this.detach(prevContainer);
    }
    this.spec.container = container;
    if (container) {
      const nextContainer = isString(container) ? this.view.getMarkById(container) : container;
      this.attach(nextContainer);
    }
    this.commit();
    return this;
  }

  direction(direction: MarkFunctionType<Direction> | Nil) {
    return this.setFunctionSpec(direction, 'direction');
  }

  position(position: MarkFunctionType<OrientType> | Nil) {
    return this.setFunctionSpec(position, 'position');
  }

  setScrollStart(start: number) {
    const scrollbar = this.elements[0]?.getGraphicItem?.() as unknown as ScrollbarComponent;
    const range = scrollbar?.attribute?.range;
    if (scrollbar && range) {
      const nextRange: [number, number] = [start, range[1] - range[0] + start];
      scrollbar.setScrollRange(nextRange);
    }
    return this;
  }

  addGraphicItem(attrs: any, groupKey?: string) {
    const defaultAttributes = { range: [0, 1] };
    const initialAttributes = merge(defaultAttributes, attrs);
    const graphicItem = Factory.createGraphicComponent(ComponentEnum.scrollbar, initialAttributes);
    const range = initialAttributes.range;
    // Hack for the first evaluation, waiting for components to fix
    if (range && this._filterCallback) {
      setTimeout(() => this._filterCallback({ detail: { value: range } }, this.elements[0]));
    }
    return super.addGraphicItem(initialAttributes, groupKey, graphicItem);
  }

  release() {
    if (this._filterCallback) {
      this.view.removeEventListener('scroll', this._filterCallback);
    }
    super.release();
  }

  protected _updateComponentEncoders() {
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            const theme = this.view.getCurrentTheme();
            const direction = invokeFunctionType(this.spec.direction, parameters, datum, element);
            const position = invokeFunctionType(this.spec.position, parameters, datum, element);
            const addition = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
            const targetMark = this.spec.container
              ? isString(this.spec.container)
                ? this.view.getMarkById(this.spec.container)
                : this.spec.container
              : null;
            const groupMark = targetMark && targetMark.markType === GrammarMarkType.group ? targetMark : this.group;
            const groupGraphicItem = groupMark.getGroupGraphicItem();
            const size = groupGraphicItem
              ? {
                  width: groupGraphicItem.attribute.width ?? groupGraphicItem.AABBBounds.width(),
                  height: groupGraphicItem.attribute.height ?? groupGraphicItem.AABBBounds.height()
                }
              : { width: this.view.width(), height: this.view.height() };
            return generateScrollbarAttributes(size, direction, position, theme, addition);
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }
}

export const registerScrollbar = () => {
  Factory.registerGraphicComponent(
    ComponentEnum.scrollbar,
    (attrs: ScrollBarAttributes) => new ScrollbarComponent(attrs) as unknown as IGraphic
  );

  Factory.registerComponent(ComponentEnum.scrollbar, Scrollbar);
  registerScrollbarFilter();
};
