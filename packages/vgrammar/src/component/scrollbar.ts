import { isString, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender';
import type { Direction, OrientType, ScrollBarAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { ScrollBar as ScrollbarComponent } from '@visactor/vrender-components';
import type {
  BaseSignleEncodeSpec,
  IElement,
  IGroupMark,
  ITheme,
  IView,
  MarkFunctionType,
  Nil,
  RecursivePartial,
  StateEncodeSpec
} from '../types';
import { ComponentEnum, GrammarMarkType } from '../graph';
import type { IScrollbar, ScrollbarSpec } from '../types/component';
import { Component } from '../view/component';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType } from '../parse/util';
import { Factory } from '../core/factory';

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

export class Scrollbar extends Component implements IScrollbar {
  static readonly componentType: string = ComponentEnum.scrollbar;
  protected declare spec: ScrollbarSpec;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.scrollbar, group);
    this.spec.componentType = ComponentEnum.scrollbar;
  }

  protected parseAddition(spec: ScrollbarSpec) {
    super.parseAddition(spec);
    this.target(spec.target);
    this.direction(spec.direction);
    this.position(spec.position);
    return this;
  }

  target(container: IGroupMark | string | Nil): this {
    if (this.spec.target) {
      const prevContainer = isString(this.spec.target) ? this.view.getMarkById(this.spec.target) : this.spec.target;
      this.detach(prevContainer);
    }
    this.spec.target = container;
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

  addGraphicItem(attrs: any, groupKey?: string) {
    const defaultAttributes = { range: [0, 1] };
    const initialAttributes = merge(defaultAttributes, attrs);
    const graphicItem = Factory.createGraphicComponent(ComponentEnum.scrollbar, initialAttributes);
    return super.addGraphicItem(initialAttributes, groupKey, graphicItem);
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
            const targetMark = this.spec.target
              ? isString(this.spec.target)
                ? this.view.getMarkById(this.spec.target)
                : this.spec.target
              : null;
            const groupMark = targetMark && targetMark.markType === GrammarMarkType.group ? targetMark : this.group;
            const groupGraphicItem = groupMark.getGroupGraphicItem();
            const size = groupGraphicItem
              ? {
                  width: groupGraphicItem.attribute.width ?? groupGraphicItem.AABBBounds.width(),
                  height: groupGraphicItem.attribute.height ?? groupGraphicItem.AABBBounds.height()
                }
              : { width: this.view.width(), height: this.view.height() };
            return generateScrollbarAttributes(size, direction, position, theme, addition); // direction, position,
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
};
