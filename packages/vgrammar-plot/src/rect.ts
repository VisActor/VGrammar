import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import type { RectEncodeChannels, PlotRectEncoderSpec, SemanticTooltipOption, WithDefaultEncode } from './interface';
import type { GenerateBaseEncodeSpec, CrosshairSpec, Nil, ScaleSpec, ValueOf, IElement } from '@visactor/vgrammar';
import { SemanticMark } from './semantic-mark';
import { getPalette, GrammarMarkType } from '@visactor/vgrammar';
import { isArray } from '@visactor/vutils';
import { PlotMakType } from './enums';

export class RectSemanticMark extends SemanticMark<PlotRectEncoderSpec, RectEncodeChannels> {
  static readonly type = PlotMakType.rect;
  constructor(id?: string | number) {
    super(PlotMakType.rect, id);
  }

  setMarkType() {
    return GrammarMarkType.rect;
  }

  parseScaleByEncode(
    channel: RectEncodeChannels,
    option: ValueOf<WithDefaultEncode<PlotRectEncoderSpec, RectEncodeChannels>, RectEncodeChannels>
  ): ScaleSpec | Nil {
    return this.parseScaleOfCommonEncode(channel, option);
  }

  setDefaultCorsshair(): Record<string, Pick<CrosshairSpec, 'crosshairShape' | 'crosshairType'>> {
    return {
      x: { crosshairShape: 'rect' }
    };
  }

  setDefaultTooltip(): SemanticTooltipOption | Nil {
    const encodeY = this.spec.encode?.y;
    return {
      content: isArray(encodeY)
        ? encodeY.map(entry => {
            return {
              value: entry
            };
          })
        : [
            {
              value: encodeY
            }
          ]
    };
  }

  convertMarkEncode(
    encode: WithDefaultEncode<PlotRectEncoderSpec, RectEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotRectEncoderSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);
    const scaleXId = this.getScaleId('x');
    const scaleYId = this.getScaleId('y');
    const res: GenerateBaseEncodeSpec<PlotRectEncoderSpec> = {};

    if (isArray(markEncoder.x?.field)) {
      res.x = { field: markEncoder.x.field[0], scale: markEncoder.x.scale };
      res.x1 = { field: markEncoder.x.field[1], scale: markEncoder.x.scale };
    } else {
      const xAccessor = getFieldAccessor(markEncoder.x.field);
      res.x = (datum: any, el: IElement, params: any) => {
        const xVals = xAccessor(datum);
        const scale = params[scaleXId];

        return isArray(xVals) ? scale.scale(xVals[0]) : scale.scale(xVals);
      };
      res.x1 = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleXId];
        const xVals = xAccessor(datum);

        if (isArray(xVals) && xVals.length > 1) {
          return scale.scale(xVals[1]);
        }
        const domain = scale.domain();
        const min = Math.min.apply(null, domain);
        const max = Math.max.apply(null, domain);
        const baseValue = min > 0 ? min : max < 0 ? max : 0;

        return scale.scale(baseValue);
      };
    }

    if (isArray(markEncoder.y?.field)) {
      res.y = { field: markEncoder.y.field[0], scale: markEncoder.y.scale };
      res.y1 = { field: markEncoder.y.field[1], scale: markEncoder.y.scale };
    } else {
      const yAccessor = getFieldAccessor(markEncoder.y.field);
      res.y = (datum: any, el: IElement, params: any) => {
        const yVals = yAccessor(datum);
        const scale = params[scaleYId];

        return isArray(yVals) ? scale.scale(yVals[0]) : scale.scale(yVals);
      };
      res.y1 = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleYId];
        const yVals = yAccessor(datum);

        if (isArray(yVals) && yVals.length > 1) {
          return scale.scale(yVals[1]);
        }
        const domain = scale.domain();
        const min = Math.min.apply(null, domain);
        const max = Math.max.apply(null, domain);
        const baseValue = min > 0 ? min : max < 0 ? max : 0;

        return scale.scale(baseValue);
      };
    }

    if (markEncoder.color || markEncoder.group) {
      res.fill = markEncoder.color ?? markEncoder.group;
    } else {
      res.fill = this.spec.style?.fill ?? getPalette()[0];
    }

    return res;
  }
}
