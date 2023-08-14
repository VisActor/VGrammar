import { array, isNil, isString, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender';
import type { BaseLabelAttrs, DataLabelAttrs } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { DataLabel } from '@visactor/vrender-components';
import { registerComponent } from '../view/register-component';
import type {
  BaseSignleEncodeSpec,
  IElement,
  IGroupMark,
  IMark,
  ITheme,
  IView,
  MarkFunctionType,
  Nil,
  StateEncodeSpec
} from '../types';
import { ComponentEnum, GrammarMarkType } from '../graph';
import type { ILabel, LabelSpec } from '../types/component';
import { Component } from '../view/component';
import { invokeEncoder } from '../graph/mark/encode';
import { BridgeElementKey } from '../graph/constants';
import { invokeFunctionType } from '../parse/util';

registerComponent(ComponentEnum.label, (attrs: DataLabelAttrs) => new DataLabel(attrs) as unknown as IGraphic);

export const generateLabelAttributes = (
  marks: IMark[],
  groupSize: { width: number; height: number },
  encoder: BaseSignleEncodeSpec,
  labelStyle: MarkFunctionType<Partial<BaseLabelAttrs>>,
  parameters: any,
  theme?: ITheme
): DataLabelAttrs => {
  const labelTheme = theme?.components?.dataLabel;

  const dataLabels = marks
    .map(mark => {
      let currentTheme: any = {};
      switch (mark.markType) {
        case GrammarMarkType.line:
          currentTheme = theme?.components?.lineLabel;
          break;
        case GrammarMarkType.rect:
          currentTheme = theme?.components?.rectLabel;
          break;
        case GrammarMarkType.symbol:
        case GrammarMarkType.circle:
          currentTheme = theme?.components?.symbolLabel;
          break;
        case GrammarMarkType.arc:
          currentTheme = theme?.components?.arcLabel;
          break;
        default:
          return null;
      }
      const data: any[] = [];
      mark.graphicItem.forEachChildren(child => {
        if ((child as any).releaseStatus !== 'willRelease') {
          const element: IElement = child[BridgeElementKey];
          const attributes = invokeEncoder(encoder, element.getDatum(), element, parameters);
          const datum = merge({}, currentTheme?.data?.[0] ?? {}, attributes);
          data.push(datum);
        }
      });
      const addition = invokeFunctionType(labelStyle, parameters, mark);
      const graphicItemName = mark.graphicItem?.name;
      return merge({}, currentTheme, { data, baseMarkGroupName: graphicItemName }, addition ?? {});
    })
    .filter(label => !isNil(label));
  return merge({}, labelTheme, { size: groupSize, dataLabels });
};

export class Label extends Component implements ILabel {
  protected declare spec: LabelSpec;

  constructor(view: IView, group?: IGroupMark) {
    super(view, ComponentEnum.label, group);
    this.spec.componentType = ComponentEnum.label;
  }

  protected parseAddition(spec: LabelSpec) {
    super.parseAddition(spec);
    this.labelStyle(spec.labelStyle);
    this.size(spec.size);
    this.target(spec.target);
    return this;
  }

  labelStyle(style: MarkFunctionType<Partial<BaseLabelAttrs>>) {
    return this.setFunctionSpec(style, 'labelStyle');
  }

  size(size: LabelSpec['size']) {
    return this.setFunctionSpec(size, 'size');
  }

  target(mark: IMark | IMark[] | string | string[] | Nil): this {
    if (this.spec.target) {
      const prevMarks = array(this.spec.target).map(m => (isString(m) ? this.view.getMarkById(m) : m));
      this.detach(prevMarks);
    }
    this.spec.target = mark;
    if (mark) {
      const nextMarks = array(mark).map(m => (isString(m) ? this.view.getMarkById(m) : m));
      this.attach(nextMarks);
    }
    this.commit();
    return this;
  }

  protected _updateComponentEncoders() {
    const encoders = Object.assign({ update: {} }, this.spec.encode);
    const componentEncoders: StateEncodeSpec = Object.keys(encoders).reduce((res, state) => {
      const encoder = encoders[state];
      if (encoder) {
        res[state] = {
          callback: (datum: any, element: IElement, parameters: any) => {
            const marks = array(this.spec.target).map(m => (isString(m) ? this.view.getMarkById(m) : m));
            const groupGraphicItem = this.group?.getGroupGraphicItem?.();
            let size = invokeFunctionType(this.spec.size, parameters);
            if (!size) {
              size = groupGraphicItem
                ? { width: groupGraphicItem.attribute.width, height: groupGraphicItem.attribute.height }
                : { width: Infinity, height: Infinity };
            }
            const theme = this.view.getCurrentTheme();

            return generateLabelAttributes(
              marks,
              size,
              encoder as BaseSignleEncodeSpec,
              this.spec.labelStyle,
              parameters,
              theme
            );
          }
        };
      }
      return res;
    }, {});
    this._encoders = componentEncoders;
  }
}
