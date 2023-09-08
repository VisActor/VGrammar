import { isString, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender';
import type { ScrollBarAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { ScrollBar as ScrollbarComponent } from '@visactor/vrender-components';
import { getComponent, registerComponent } from '../view/register-component';
import type {
  BaseSignleEncodeSpec,
  IElement,
  IGroupMark,
  IMark,
  ITheme,
  IView,
  Nil,
  RecursivePartial,
  StateEncodeSpec
} from '../types';
import { ComponentEnum } from '../graph';
import type { IScrollbar, ScrollbarSpec } from '../types/component';
import { Component } from '../view/component';
import { invokeEncoder } from '../graph/mark/encode';

registerComponent(
  ComponentEnum.scrollbar,
  (attrs: ScrollBarAttributes) => new ScrollbarComponent(attrs) as unknown as IGraphic
);

export const generateScrollbarAttributes = (
  theme?: ITheme,
  addition?: RecursivePartial<ScrollBarAttributes>
): ScrollBarAttributes => {
  const scrollbarTheme = theme?.components?.scrollbar;
  const attributes: RecursivePartial<ScrollBarAttributes> = {};
  return merge({}, scrollbarTheme, attributes, addition ?? {});
};

export class Scrollbar extends Component implements IScrollbar {
  protected declare spec: ScrollbarSpec;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.scrollbar, group);
    this.spec.componentType = ComponentEnum.scrollbar;
  }

  protected parseAddition(spec: ScrollbarSpec) {
    super.parseAddition(spec);
    this.target(spec.target);
    return this;
  }

  target(container: IMark | string | Nil): this {
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

  addGraphicItem(attrs: any, groupKey?: string) {
    const defaultAttributes = { range: [0, 1] };
    const initialAttributes = merge(defaultAttributes, attrs);
    const graphicItem = getComponent(ComponentEnum.scrollbar).creator(initialAttributes);
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
            const addition = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
            return generateScrollbarAttributes(theme, addition);
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }
}
