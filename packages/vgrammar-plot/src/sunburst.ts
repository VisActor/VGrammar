import type {
  SunburstEncodeChannels,
  WithDefaultEncode,
  PlotSunburstEncodeSpec,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  Nil,
  ScaleSpec,
  ValueOf,
  TransformSpec,
  IElement,
  DataSpec,
  LabelSpec
} from '@visactor/vgrammar';
import { SemanticMark } from './semantic-mark';
import { GrammarMarkType, SIGNAL_VIEW_BOX, getTransform, ThemeManager } from '@visactor/vgrammar';
import { PlotMakType } from './enums';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import type { BaseLabelAttrs } from '@visactor/vrender-components';

export class SunburstSemanticMark extends SemanticMark<PlotSunburstEncodeSpec, SunburstEncodeChannels> {
  static readonly type = PlotMakType.sunburst;
  constructor(id?: string | number) {
    super(PlotMakType.sunburst, id);

    if (!getTransform('sunburst')) {
      this._logger.error(
        `Please add this line of code: import { registerSunburstTransforms } from 'vgrammar-hierarchy': 
        and run registerSunburstTransforms() before use sunburst chart`
      );
    }
  }

  setMarkType() {
    return GrammarMarkType.arc;
  }

  setDefaultDataTransform(): TransformSpec[] {
    return [
      {
        type: 'sunburst',
        width: { signal: 'viewWidth' },
        height: { signal: 'viewHeight' },
        nodeKey: this.spec.encode?.node,
        flatten: true
      }
    ];
  }

  getDataIdOfLabel() {
    return `${this.spec.data?.id ?? this.spec.id}-data-link`;
  }

  setMultipleData(): DataSpec[] {
    if (this.spec.label) {
      return [
        {
          source: this.getDataIdOfFiltered(),
          id: this.getDataIdOfLabel(),
          transform: [
            {
              type: 'filter',
              callback: (datum: any) => {
                return !!datum.label;
              }
            }
          ]
        }
      ];
    }

    return null;
  }

  parseScaleByEncode(
    channel: SunburstEncodeChannels,
    option: ValueOf<WithDefaultEncode<PlotSunburstEncodeSpec, SunburstEncodeChannels>, SunburstEncodeChannels>
  ): ScaleSpec | Nil {
    if (channel === 'color') {
      return {
        type: 'ordinal',
        id: this.getScaleId('color'),
        domain: {
          data: this.getDataIdOfFiltered(),
          field: option as string
        },
        range: ThemeManager.getDefaultTheme().palette?.default
      };
    }

    return null;
  }

  convertMarkEncode(
    encode: WithDefaultEncode<PlotSunburstEncodeSpec, SunburstEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotSunburstEncodeSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res: GenerateEncoderSpec<PlotSunburstEncodeSpec> = {
      x: { field: 'x' },
      y: { field: 'y' },
      innerRadius: { field: 'innerRadius' },
      outerRadius: { field: 'outerRadius' },
      startAngle: { field: 'startAngle' },
      endAngle: { field: 'endAngle' }
    };

    if (markEncoder.color) {
      const scaleColorId = this.getScaleId('color');
      const colorAccessor = getFieldAccessor(markEncoder.color.field);

      res.fill = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleColorId];
        return datum?.datum ? scale.scale(colorAccessor(datum.datum[datum.datum.length - 1])) : undefined;
      };
    } else {
      res.fill = this.spec.style?.fill ?? ThemeManager.getDefaultTheme().palette?.default?.[0];
    }

    return res;
  }

  protected setMainMarkEnterEncode() {
    return this.spec.style?.nodeStyle;
  }

  setMainMarkSpec() {
    return { key: 'key' };
  }

  protected parseLabelSpec(): LabelSpec[] {
    // TODO use arc label in the future
    return [];
  }

  setMultiMarksSpec() {
    const label = this.spec.label;

    if (!label) {
      return null;
    }

    return Object.keys(label).map(key => {
      const textGetter = getFieldAccessor(key);
      return {
        id: `${this.getMarkId()}-text-${key}`,
        type: 'text',
        from: {
          data: this.getDataIdOfLabel()
        },
        layout: {
          position: 'content',
          skipBeforeLayouted: true
        },
        key: 'flattenIndex',
        dependency: this.viewSpec.scales.map(scale => scale.id).concat(SIGNAL_VIEW_BOX),
        animation: this.convertMarkAnimation(),
        encode: {
          enter: (label[key] as Partial<BaseLabelAttrs>).textStyle,
          update: (datum: any, el: IElement, params: any) => {
            return {
              x: datum.label.x,
              y: datum.label.y,
              textAlign: datum.label.textAlign,
              textBaseline: datum.label.textBaseline,
              text: textGetter(datum.datum[datum.datum.length - 1]),
              angle: datum.label.angle,
              maxLineWidth: datum.label.maxLineWidth
            };
          }
        }
      };
    });
  }
}
