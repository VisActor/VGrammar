import type { AreaEncodeChannels, SemanticTooltipOption, WithDefaultEncode, PlotAreaEncoderSpec } from './interface';
import type {
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  Nil,
  ScaleSpec,
  ValueOf,
  IElement,
  CrosshairSpec
} from '@visactor/vgrammar';
import { SemanticMark } from './semantic-mark';
import { getPalette, GrammarMarkType } from '@visactor/vgrammar';
import { isArray } from '@visactor/vutils';
import { PlotMakType } from './enums';

export class Area extends SemanticMark<PlotAreaEncoderSpec, AreaEncodeChannels> {
  static readonly type = PlotMakType.area;
  constructor(id?: string | number) {
    super(PlotMakType.area, id);
  }

  setMarkType() {
    return GrammarMarkType.area;
  }

  protected parseScaleOfEncodeX(
    option: ValueOf<WithDefaultEncode<PlotAreaEncoderSpec, AreaEncodeChannels>, AreaEncodeChannels>
  ): ScaleSpec | Nil {
    const res = super.parseScaleOfEncodeX(option);

    res.type = 'point';
    return res;
  }

  parseScaleByEncode(
    channel: AreaEncodeChannels,
    option: ValueOf<WithDefaultEncode<PlotAreaEncoderSpec, AreaEncodeChannels>, AreaEncodeChannels>
  ): ScaleSpec | Nil {
    return this.parseScaleOfCommonEncode(channel, option);
  }

  setDefaultCorsshair(): Record<string, Pick<CrosshairSpec, 'crosshairShape' | 'crosshairType'>> {
    return {
      x: { crosshairShape: 'line' }
    };
  }

  setDefaultTooltip(): SemanticTooltipOption | Nil {
    const encodeX = this.spec.encode?.x;
    const encodeY = this.spec.encode?.y;
    return {
      disableGraphicTooltip: true,
      title: isArray(encodeX) ? encodeX[0] : encodeX,
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
    encode: WithDefaultEncode<PlotAreaEncoderSpec, AreaEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotAreaEncoderSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    let res: GenerateEncoderSpec<PlotAreaEncoderSpec>;

    if (isArray(markEncoder.x?.field)) {
      res = {
        y: markEncoder.y,
        x: { field: markEncoder.x.field[0], scale: markEncoder.x.scale },
        x1: { field: markEncoder.x.field[1], scale: markEncoder.x.scale }
      } as GenerateEncoderSpec<PlotAreaEncoderSpec>;
    } else if (isArray(markEncoder.y?.field)) {
      res = {
        y: { field: markEncoder.y.field[0], scale: markEncoder.y.scale },
        y1: { field: markEncoder.y.field[1], scale: markEncoder.y.scale },
        x: markEncoder.x
      } as GenerateEncoderSpec<PlotAreaEncoderSpec>;
    } else {
      const scaleYId = this.getScaleId('y');
      res = {
        x: markEncoder.x,
        y: markEncoder.y,
        y1: (datum: any, el: IElement, params: any) => {
          const scale = params[scaleYId];
          const domain = scale.domain();
          const min = Math.min.apply(null, domain);
          const max = Math.max.apply(null, domain);
          const baseValue = min > 0 ? min : max < 0 ? max : 0;

          return scale.scale(baseValue);
        }
      } as GenerateEncoderSpec<PlotAreaEncoderSpec>;
    }

    if (markEncoder.color || markEncoder.group) {
      res.fill = markEncoder.color ?? markEncoder.group;
    } else {
      res.fill = this.spec.style?.fill ?? getPalette()[0];
    }

    return res;
  }
}
