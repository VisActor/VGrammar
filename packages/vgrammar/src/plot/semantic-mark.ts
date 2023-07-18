import type {
  AxisBaseAttributes,
  LegendBaseAttributes,
  SliderAttributes,
  DataZoomAttributes,
  BaseLabelAttrs,
  BasePlayerAttributes,
  BaseCrosshairAttrs
} from '@visactor/vrender-components';
import type {
  ScaleSpec,
  TransformSpec,
  MarkAnimationSpec,
  ViewSpec,
  MarkType,
  Nil,
  ValueOf,
  GenerateBaseEncodeSpec,
  ISemanticMark,
  ISemanticMarkSpec,
  ISemanticStyle,
  ParsedSimpleEncode,
  WithDefaultEncode,
  IElement
} from '../types';
import { isNil } from '@visactor/vutils';
import type { IBaseScale } from '@visactor/vscale';
import { getPalette } from '../palette';
import type { AxisSpec } from '../types/component';
import type { ComponentEnum } from '../graph/enums';

let semanticMarkId = -1;

export abstract class SemanticMark<EncodeSpec, K extends string> implements ISemanticMark<EncodeSpec, K> {
  //declare type: T;
  spec: ISemanticMarkSpec<EncodeSpec, K>;
  viewSpec?: ViewSpec;

  private _uid: number;
  readonly type: string;

  constructor(type: string, id?: string | number) {
    this.type = type;
    this._uid = ++semanticMarkId;

    this.spec = { id: id ?? `${this.type}-${this._uid}` };
  }

  data(values: any) {
    if (isNil(values)) {
      return this;
    }

    this.spec.data = { values };
    return this;
  }

  encode(channel: K, option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>) {
    if (!this.spec.encode) {
      this.spec.encode = {};
    }
    this.spec.encode[channel] = option;

    return this;
  }
  scale(channel: string, option: ScaleSpec) {
    if (!this.spec.scale) {
      this.spec.scale = {};
    }

    this.spec.scale[channel] = option;
    return this;
  }
  style(style: ISemanticStyle<EncodeSpec, K>) {
    this.spec.style = style;
    return this;
  }
  transform: (option: TransformSpec) => this;
  animate: (state: string, option: MarkAnimationSpec) => this;
  state: (state: string, option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>) => this;
  axis(channel: string, option?: AxisBaseAttributes | boolean) {
    if (!this.spec.axis) {
      this.spec.axis = {};
    }
    this.spec.axis[channel] = option;

    return this;
  }
  legend: (channel: string, option?: LegendBaseAttributes) => this;
  slider: (channel: string, option?: SliderAttributes) => this;
  datazoom: (channel: string, option?: DataZoomAttributes) => this;
  tooltip: (option: { title?: string; content?: { key?: string; value?: string; symbol?: string }[] }) => this;
  label: (channel: string, option?: BaseLabelAttrs) => this;
  player: (channel: string, option?: BasePlayerAttributes) => this;
  crosshair: (channel: string, option?: BaseCrosshairAttrs) => this;

  abstract setMarkType(): MarkType;
  abstract parseScaleByEncode(channel: K, option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>): ScaleSpec | Nil;
  abstract convertMarkEncode(encode: WithDefaultEncode<EncodeSpec, K>): GenerateBaseEncodeSpec<EncodeSpec>;

  protected convertSimpleMarkEncode(encode: WithDefaultEncode<EncodeSpec, K>): ParsedSimpleEncode<EncodeSpec, K> {
    if (!encode) {
      return {};
    }

    const markEncoder = {};

    Object.keys(encode).map(channel => {
      markEncoder[channel] = { field: encode[channel], scale: this.generateScaleId(channel) };
    });

    return markEncoder;
  }

  protected generateDataId() {
    return `${this.spec.id}-data`;
  }

  protected generateScaleId(channel: string) {
    return `${this.spec.id}-scale-${channel}`;
  }

  protected parseScaleOfEncodeX(option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>): ScaleSpec | Nil {
    return {
      type: 'band',
      id: this.generateScaleId('x'),
      dependency: ['viewBox'],
      domain: {
        data: this.generateDataId(),
        field: option as string
      },
      range: (scale: IBaseScale, params: any) => {
        return [params.viewBox.x1, params.viewBox.x2];
      }
    };
  }

  protected parseScaleOfEncodeY(option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>): ScaleSpec | Nil {
    return {
      type: 'linear',
      dependency: ['viewBox'],
      id: this.generateScaleId('y'),
      domain: {
        data: this.generateDataId(),
        field: option as string
      },
      range: (scale: IBaseScale, params: any) => {
        return [params.viewBox.y2, params.viewBox.y1];
      }
    };
  }

  protected parseScaleOfEncodeColor(option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>): ScaleSpec | Nil {
    return {
      type: 'ordinal',
      id: this.generateScaleId('color'),
      domain: {
        data: this.generateDataId(),
        field: option as string
      },
      range: getPalette()
    };
  }
  protected parseScaleOfEncodeGroup(option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>): ScaleSpec | Nil {
    return {
      type: 'ordinal',
      id: this.generateScaleId('group'),
      domain: {
        data: this.generateDataId(),
        field: option as string
      },
      range: getPalette()
    };
  }

  protected parseScaleOfCommonEncode(
    channel: K,
    option: ValueOf<WithDefaultEncode<EncodeSpec, K>, K>
  ): ScaleSpec | Nil {
    if (channel === 'x') {
      return this.parseScaleOfEncodeX(option);
    }

    if (channel === 'y') {
      return this.parseScaleOfEncodeY(option);
    }

    if (channel === 'color') {
      return this.parseScaleOfEncodeColor(option);
    }

    if (channel === 'group') {
      return this.parseScaleOfEncodeGroup(option);
    }

    return null;
  }

  protected parseAxisSpec(): AxisSpec[] {
    const axis = this.spec.axis;
    const res: AxisSpec[] = [];

    if (axis) {
      Object.keys(axis).forEach(channel => {
        const axisOption = axis[channel];

        if (axisOption) {
          res.push({
            type: 'component',
            componentType: 'axis' as ComponentEnum.axis,
            scale: this.generateScaleId(channel),
            dependency: ['viewBox'],
            encode: {
              update:
                channel === 'x'
                  ? (datum: any, elment: IElement, params: any) => {
                      return {
                        x: params.viewBox.x1,
                        y: params.viewBox.y2,
                        start: { x: 0, y: 0 },
                        end: { x: params.viewBox.width(), y: 0 }
                      };
                    }
                  : (datum: any, elment: IElement, params: any) => {
                      return {
                        x: params.viewBox.x1,
                        y: params.viewBox.y2,
                        start: { x: 0, y: 0 },
                        verticalFactor: -1,
                        end: { x: 0, y: -params.viewBox.height() }
                      };
                    }
            }
          });
        }
      });
    }

    return res;
  }

  toViewSpec(): ViewSpec {
    this.viewSpec = {};
    const dataId = this.generateDataId();

    const { encode, scale, data } = this.spec;

    if (data) {
      this.viewSpec.data = [
        {
          id: dataId,
          values: this.spec.data.values
        }
      ];
    }
    const scales: Record<string, ScaleSpec> = {};
    if (encode) {
      Object.keys(encode).forEach(k => {
        const encodeOption = encode[k];
        const scaleId = this.generateScaleId(k);

        scales[scaleId] = Object.assign(
          { id: scaleId },
          this.parseScaleByEncode(k as K, encodeOption),
          this.spec.scale?.[k]
        );
      });
    }

    if (scale) {
      Object.keys(scale).forEach(k => {
        const scaleId = this.generateScaleId(k);
        if (!scales[scaleId]) {
          scales[scaleId] = scale[k];
        }
      });
    }

    this.viewSpec.scales = Array.from(Object.values(scales));
    this.viewSpec.marks = [
      {
        type: this.setMarkType(),
        from: {
          data: dataId
        },
        dependency: Array.from(Object.keys(scales)),
        encode: {
          enter: this.spec.style ?? {},
          update: this.convertMarkEncode(this.spec.encode)
        }
      }
    ];

    if (this.spec.axis) {
      this.viewSpec.marks = this.viewSpec.marks.concat(this.parseAxisSpec());
    }

    return this.viewSpec;
  }

  clear() {
    this.spec = { id: this.spec.id };
  }
}
