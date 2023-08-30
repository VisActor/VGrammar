import { isValid, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender';
import type { TitleAttrs } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { Title as TitleComponent } from '@visactor/vrender-components';
import { registerComponent } from '../view/register-component';
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
import { ComponentEnum } from '../graph';
import type { ITitle, TitleSpec } from '../types/component';
import { Component } from '../view/component';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType } from '../parse/util';

registerComponent(ComponentEnum.title, (attrs: TitleAttrs) => new TitleComponent(attrs) as unknown as IGraphic);

export const generateTitleAttributes = (
  title?: string | string[],
  subTitle?: string | string[],
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
  protected declare spec: TitleSpec;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.title, group);
    this.spec.componentType = ComponentEnum.title;
  }

  protected parseAddition(spec: TitleSpec) {
    super.parseAddition(spec);
    return this;
  }

  title(text: MarkFunctionType<string | string[]> | Nil) {
    return this.setFunctionSpec(text, 'title');
  }

  subTitle(text: MarkFunctionType<string | string[]> | Nil) {
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
