import { isNil, isString, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender';
import type { SliderAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { Slider as SliderComponent } from '@visactor/vrender-components';
import { registerComponent } from '../view/register-component';
import type {
  IData,
  IElement,
  IGroupMark,
  IView,
  MarkFunctionType,
  Nil,
  RecursivePartial,
  StateEncodeSpec
} from '../types';
import { ComponentDataRank, ComponentEnum } from '../graph';
import type { ISlider, SliderFilterValue, SliderSpec } from '../types/component';
import { Component } from '../view/component';
import { defaultTheme } from '../theme/default';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType } from '../parse/util';

registerComponent(ComponentEnum.slider, (attrs: SliderAttributes) => new SliderComponent(attrs) as unknown as IGraphic);

export const generateSliderAttributes = (
  min: number,
  max: number,
  addition?: RecursivePartial<SliderAttributes>
): SliderAttributes => {
  const sliderTheme = defaultTheme.slider;
  return merge({}, sliderTheme, { min, max, value: [min, max] }, addition ?? {});
};

export class Slider extends Component implements ISlider {
  protected declare spec: SliderSpec;
  protected declare _filterValue: SliderFilterValue;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.slider, group);
    this.spec.componentType = ComponentEnum.slider;
  }

  protected parseAddition(spec: SliderSpec) {
    super.parseAddition(spec);
    this.target(spec.target?.data, spec.target?.filter);
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

  target(data: IData | string | Nil, filter: string | ((datum: any, value: SliderFilterValue) => boolean) | Nil) {
    const lastData = this.spec.target?.data;
    const lastDataGrammar = isString(lastData) ? this.view.getDataById(lastData) : lastData;
    if (lastDataGrammar) {
      this.view.removeEventListener('change', this._filterCallback);
    }
    this.spec.target = undefined;
    const dataGrammar = isString(data) ? this.view.getDataById(data) : data;
    const getFilterValue = (event: any) => ({ start: event.detail.value[0], end: event.detail.value[1] });
    const dataFilter = isString(filter)
      ? (datum: any, filterValue: SliderFilterValue) =>
          datum[filter] >= filterValue.start && datum[filter] <= filterValue.end
      : filter;
    this._filterData(lastDataGrammar, dataGrammar, ComponentDataRank.slider, getFilterValue, dataFilter);
    if (dataGrammar) {
      this.view.addEventListener('change', this._filterCallback);
      this.spec.target = { data: dataGrammar, filter };
    }
    return this;
  }

  setStartEndValue(start?: number, end?: number) {
    const slider = this.elements[0]?.getGraphicItem?.() as unknown as SliderComponent;
    slider.setValue([start, end]);
    return this;
  }

  release() {
    if (this._filterCallback) {
      this.view.removeEventListener('change', this._filterCallback);
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
            const min = !isNil(this.spec.min) ? invokeFunctionType(this.spec.min, parameters, datum, element) : 0;
            const max = !isNil(this.spec.max) ? invokeFunctionType(this.spec.max, parameters, datum, element) : 1;
            const addition = invokeEncoder(encoder, datum, element, parameters);
            return generateSliderAttributes(min, max, addition);
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }
}
