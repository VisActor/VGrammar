import type {
  PolygonEncodeChannels,
  WithDefaultEncode,
  PlotPolygonEncoderSpec,
  GenerateBaseEncodeSpec,
  Nil,
  ScaleSpec,
  ValueOf,
  IElement,
  GenerateEncoderSpec
} from '@visactor/vgrammar-core';
import { SemanticMark } from './semantic-mark';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import { PlotMakType } from './enums';
// eslint-disable-next-line no-duplicate-imports
import { GrammarMarkType } from '@visactor/vgrammar-core';

export class PolygonSemanticMark extends SemanticMark<PlotPolygonEncoderSpec, PolygonEncodeChannels> {
  static readonly type = PlotMakType.polygon;
  constructor(id?: string | number) {
    super(PlotMakType.polygon, id);
  }

  setMarkType() {
    return GrammarMarkType.polygon;
  }

  protected parseScaleOfEncodeX(
    option: ValueOf<WithDefaultEncode<PlotPolygonEncoderSpec, PolygonEncodeChannels>, PolygonEncodeChannels>
  ): ScaleSpec | Nil {
    const res = super.parseScaleOfEncodeX(option);

    res.type = 'point';
    return res;
  }

  parseScaleByEncode(
    channel: PolygonEncodeChannels,
    option: ValueOf<WithDefaultEncode<PlotPolygonEncoderSpec, PolygonEncodeChannels>, PolygonEncodeChannels>
  ): ScaleSpec | Nil {
    return this.parseScaleOfCommonEncode(channel, option);
  }

  convertMarkEncode(
    encode: WithDefaultEncode<PlotPolygonEncoderSpec, PolygonEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotPolygonEncoderSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);
    const scaleXId = this.getScaleId('x');
    const scaleYId = this.getScaleId('y');
    const res: GenerateEncoderSpec<PlotPolygonEncoderSpec> = {};

    if (markEncoder.x?.field?.length && markEncoder.y?.field?.length) {
      const xAccessors = markEncoder.x.field.map((f: any) => getFieldAccessor(f));
      const yAccessors = markEncoder.y.field.map((f: any) => getFieldAccessor(f));

      res.points = (datum: any, el: IElement, params: any) => {
        const scaleX = params[scaleXId];
        const scaleY = params[scaleYId];
        const minLen = Math.min(xAccessors.length, yAccessors.length);
        const points = [];

        for (let i = 0; i < minLen; i++) {
          points.push({
            x: scaleX.scale(xAccessors[i](datum)),
            y: scaleY.scale(yAccessors[i](datum))
          });
        }

        return points;
      };
    }

    if (markEncoder.stroke) {
      res.stroke = markEncoder.stroke;
    }

    if (markEncoder.color || markEncoder.group) {
      res.fill = markEncoder.color ?? markEncoder.group;
    } else {
      res.fill = this.spec.style?.fill ?? this.getPalette()?.[0];
    }

    return res;
  }
}
