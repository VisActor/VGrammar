import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import type {
  RectYEncodeChannels,
  PlotRectYEncoderSpec,
  SemanticTooltipOption,
  WithDefaultEncode,
  GenerateBaseEncodeSpec,
  CrosshairSpec,
  Nil,
  ScaleSpec,
  ValueOf,
  IElement
} from '@visactor/vgrammar';
import { SemanticMark } from './semantic-mark';
import { isArray } from '@visactor/vutils';
import { getPalette, GrammarMarkType } from '@visactor/vgrammar';
import { PlotMakType } from './enums';

export class RectYSemanticMark extends SemanticMark<PlotRectYEncoderSpec, RectYEncodeChannels> {
  static readonly type = PlotMakType.rectY;
  constructor(id?: string | number) {
    super(PlotMakType.rectY, id);
  }

  setMarkType() {
    return GrammarMarkType.rect;
  }

  parseScaleByEncode(
    channel: RectYEncodeChannels,
    option: ValueOf<WithDefaultEncode<PlotRectYEncoderSpec, RectYEncodeChannels>, RectYEncodeChannels>
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
    encode: WithDefaultEncode<PlotRectYEncoderSpec, RectYEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotRectYEncoderSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);
    const scaleYId = this.getScaleId('y');
    const res: GenerateBaseEncodeSpec<PlotRectYEncoderSpec> = {
      x: (datum: any, el: IElement, params: any) => {
        return 0;
      },
      x1: (datum: any, el: IElement, params: any) => {
        return params.viewBox.width();
      }
    };

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
