import { array, isNil, isString, merge } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender-core';
import type { BaseLabelAttrs, DataLabelAttrs } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { DataLabel } from '@visactor/vrender-components';
import type {
  BaseSingleEncodeSpec,
  IElement,
  IGroupMark,
  IMark,
  ITheme,
  IView,
  MarkFunctionType,
  Nil,
  StateEncodeSpec
} from '../types';
import { ComponentEnum, GrammarMarkType } from '../graph/enums';
import type { ILabel, LabelSpec } from '../types/component';
import { Component } from '../view/component';
import { invokeEncoder } from '../graph/mark/encode';
import { invokeFunctionType } from '../parse/util';
import { Factory } from '../core/factory';

export const generateLabelAttributes = (
  marks: IMark[],
  groupSize: { width: number; height: number },
  encoder: BaseSingleEncodeSpec,
  labelStyle: MarkFunctionType<Partial<BaseLabelAttrs>>,
  parameters: any,
  theme: ITheme = {}
): DataLabelAttrs => {
  const labelTheme = theme.components?.dataLabel;
  const dataLabels = marks
    .map((mark, index) => {
      const labelParameters = { ...parameters, labelIndex: index };
      const addition = invokeFunctionType(labelStyle, labelParameters, mark) ?? {};
      const { components = {} } = theme;
      let currentTheme: any = {};

      switch (mark.markType) {
        case GrammarMarkType.line:
        case GrammarMarkType.area:
          if (addition.type === 'line') {
            currentTheme = components.lineLabel;
          } else if (addition.type === 'area') {
            currentTheme = components.areaLabel;
          } else {
            currentTheme = components.lineDataLabel;
          }
          break;
        case GrammarMarkType.rect:
        case GrammarMarkType.rect3d:
        case GrammarMarkType.interval:
          currentTheme = components.rectLabel;
          break;
        case GrammarMarkType.symbol:
        case GrammarMarkType.circle:
        case GrammarMarkType.cell:
          currentTheme = components.symbolLabel;
          break;
        case GrammarMarkType.arc:
        case GrammarMarkType.arc3d:
          currentTheme = components.arcLabel;
          break;
        case GrammarMarkType.polygon:
        case GrammarMarkType.path:
        default:
          currentTheme = components.pointLabel;
          break;
      }

      const data: any[] = addition.data ?? [];
      const themeDatum = currentTheme?.data?.[0] ?? {};

      if (data && data.length > 0) {
        data.forEach((d, index) => {
          if (mark.elements[index]) {
            const attributes = invokeEncoder(encoder, d, mark.elements[index], labelParameters);
            merge(d, themeDatum, attributes);
          }
        });
      } else {
        // process by order of elements
        mark.elements.forEach(element => {
          const graphicItem = element.getGraphicItem();
          if ((graphicItem as any).releaseStatus !== 'willRelease') {
            if (mark.isCollectionMark()) {
              const datum = element.getDatum();

              datum.forEach((entry: any) => {
                const attributes = invokeEncoder(encoder, entry, element, labelParameters);
                data.push(merge({}, themeDatum, attributes));
              });
            } else {
              const attributes = invokeEncoder(encoder, element.getDatum(), element, labelParameters);
              const datum = merge({}, themeDatum, attributes);
              data.push(datum);
            }
          }
        });
      }

      const graphicItemName = mark.graphicItem?.name;
      return merge(
        {},
        currentTheme,
        {
          data,
          baseMarkGroupName: graphicItemName,
          // FIXME: hack
          // 标签是对数据顺序有强要求的场景，因为顺序会影响标签躲避结果；而目前没有机制保证 vrender 图元顺序与数据顺序一致。
          // 这里目前只能通过自定义方法来 hack
          getBaseMarks: () => mark.elements.map(element => element.getGraphicItem())
        },
        addition ?? {}
      );
    })
    .filter(label => !isNil(label));

  return merge({}, labelTheme, { size: groupSize, dataLabels });
};

export class Label extends Component implements ILabel {
  static readonly componentType: string = ComponentEnum.label;
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
                ? {
                    width: groupGraphicItem.attribute.width ?? groupGraphicItem.AABBBounds.width(),
                    height: groupGraphicItem.attribute.height ?? groupGraphicItem.AABBBounds.height()
                  }
                : { width: Infinity, height: Infinity };
            }

            const theme = this.spec.skipTheme ? null : this.view.getCurrentTheme();

            return generateLabelAttributes(
              marks,
              size,
              encoder as BaseSingleEncodeSpec,
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

export const registerLabel = () => {
  Factory.registerGraphicComponent(
    ComponentEnum.label,
    (attrs: DataLabelAttrs) => new DataLabel(attrs) as unknown as IGraphic
  );

  Factory.registerComponent(ComponentEnum.label, Label);
};
