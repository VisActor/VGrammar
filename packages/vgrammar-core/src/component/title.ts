import { isValid, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender-core';
import type { TitleAttrs } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { Title as TitleComponent } from '@visactor/vrender-components';
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
import type { ITitle, TitleSpec } from '../types/component';
import { Component } from '../view/component';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType } from '../parse/util';
import { Factory } from '../core/factory';

export const generateTitleAttributes = (
  title?: string | number | number[] | string[],
  subTitle?: string | number | number[] | string[],
  theme?: ITheme,
  addition?: RecursivePartial<TitleAttrs>
): TitleAttrs => {
  const titleTheme = theme?.components?.title;
  const attributes: RecursivePartial<TitleAttrs> = {};
  if (isValid(title)) {
    attributes.text = title;
  }
  if (isValid(subTitle)) {
    attributes.subtext = subTitle;
  }
  return merge({}, titleTheme, attributes, addition ?? {});
};

export class Title extends Component implements ITitle {
  static readonly componentType: string = ComponentEnum.title;
  protected declare spec: TitleSpec;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.title, group);
    this.spec.componentType = ComponentEnum.title;
  }

  protected parseAddition(spec: TitleSpec) {
    super.parseAddition(spec);
    this.title(spec.title);
    this.subTitle(spec.subTitle);
    return this;
  }

  title(text: MarkFunctionType<string | number | number[] | string[]> | Nil) {
    return this.setFunctionSpec(text, 'title');
  }

  subTitle(text: MarkFunctionType<string | number | number[] | string[]> | Nil) {
    return this.setFunctionSpec(text, 'subTitle');
  }

  protected _updateComponentEncoders() {
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            const theme = this.view.getCurrentTheme();
            const title = invokeFunctionType(this.spec.title, parameters, datum, element);
            const subTitle = invokeFunctionType(this.spec.subTitle, parameters, datum, element);
            const addition = invokeEncoder(encoder as BaseSignleEncodeSpec, datum, element, parameters);
            return generateTitleAttributes(title, subTitle, theme, addition);
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }
}

export const registerTitle = () => {
  Factory.registerGraphicComponent(
    ComponentEnum.title,
    (attrs: TitleAttrs) => new TitleComponent(attrs) as unknown as IGraphic
  );

  Factory.registerComponent(ComponentEnum.title, Title);
};
