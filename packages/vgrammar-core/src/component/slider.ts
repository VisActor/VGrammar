import { isNil, merge, mixin } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender-core';
import type { SliderAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { Slider as SliderComponent } from '@visactor/vrender-components';
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
import { ComponentEnum } from '../graph/enums';
import type { ISlider, SliderSpec } from '../types/component';
import { Component } from '../view/component';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType } from '../parse/util';
import { Factory } from '../core/factory';
import { SliderFilter } from '../interactions/slider-filter';
import { Filter, FilterMixin } from '../interactions/filter';

export const generateSliderAttributes = (
  min: number,
  max: number,
  theme?: ITheme,
  addition?: RecursivePartial<SliderAttributes>
): SliderAttributes => {
  const sliderTheme = theme?.components?.slider;
  return merge({}, sliderTheme, { min, max, value: [min, max] }, addition ?? {});
};

export class Slider extends Component implements ISlider {
  static readonly componentType: string = ComponentEnum.slider;
  protected declare spec: SliderSpec;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.slider, group);
    this.spec.componentType = ComponentEnum.slider;
  }

  protected parseAddition(spec: SliderSpec) {
    super.parseAddition(spec);
    this.min(spec.min);
    this.max(spec.max);
    return this;
  }

  min(min: MarkFunctionType<number> | Nil) {
    return this.setFunctionSpec(min, 'min');
  }

  max(max: MarkFunctionType<number> | Nil) {
    return this.setFunctionSpec(max, 'max');
  }

  setStartEndValue(start?: number, end?: number) {
    const slider = this.elements[0]?.getGraphicItem?.() as unknown as SliderComponent;
    slider.setValue([start, end]);
    return this;
  }

  protected _updateComponentEncoders() {
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            const min = !isNil(this.spec.min) ? invokeFunctionType(this.spec.min, parameters, datum, element) : 0;
            const max = !isNil(this.spec.max) ? invokeFunctionType(this.spec.max, parameters, datum, element) : 1;
            const theme = this.spec.skipTheme ? null : this.view.getCurrentTheme();
            const addition = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
            return generateSliderAttributes(min, max, theme, addition);
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }
}

export const registerSlider = () => {
  Factory.registerGraphicComponent(
    ComponentEnum.slider,
    (attrs: SliderAttributes) => new SliderComponent(attrs) as unknown as IGraphic
  );

  Factory.registerComponent(ComponentEnum.slider, Slider);

  mixin(Filter, FilterMixin);
  Factory.registerInteraction(SliderFilter.type, SliderFilter);
};
