import type {
  LineEncodeChannels,
  SemanticTooltipOption,
  WithDefaultEncode,
  BasicEncoderSpecMap,
  GenerateBaseEncodeSpec,
  Nil,
  ScaleSpec,
  ValueOf,
  CrosshairSpec,
  GenerateEncoderSpec
} from '@visactor/vgrammar';
import { SemanticMark } from './semantic-mark';
import { getPalette, GrammarMarkType } from '@visactor/vgrammar';
import { PlotMakType } from './enums';

export class Line extends SemanticMark<BasicEncoderSpecMap['line'], LineEncodeChannels> {
  static readonly type = PlotMakType.line;
  constructor(id?: string | number) {
    super(PlotMakType.line, id);
  }

  setMarkType() {
    return GrammarMarkType.line;
  }

  protected parseScaleOfEncodeX(
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['line'], LineEncodeChannels>, LineEncodeChannels>
  ): ScaleSpec | Nil {
    const res = super.parseScaleOfEncodeX(option);

    res.type = 'point';
    return res;
  }

  parseScaleByEncode(
    channel: LineEncodeChannels,
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['line'], LineEncodeChannels>, LineEncodeChannels>
  ): ScaleSpec | Nil {
    return this.parseScaleOfCommonEncode(channel, option);
  }

  setDefaultCorsshair(): Record<string, Pick<CrosshairSpec, 'crosshairShape' | 'crosshairType'>> {
    return {
      x: { crosshairShape: 'line' }
    };
  }

  setDefaultTooltip(): SemanticTooltipOption | Nil {
    return {
      disableGraphicTooltip: true,
      title: this.spec.encode?.x,
      content: [
        {
          value: this.spec.encode?.y
        }
      ]
    };
  }

  convertMarkEncode(
    encode: WithDefaultEncode<BasicEncoderSpecMap['line'], LineEncodeChannels>
  ): GenerateBaseEncodeSpec<BasicEncoderSpecMap['line']> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res = {
      y: markEncoder.y,
      x: markEncoder.x
    } as GenerateEncoderSpec<BasicEncoderSpecMap['line']>;

    if (markEncoder.color || markEncoder.group) {
      res.stroke = markEncoder.color ?? markEncoder.group;
    } else {
      res.stroke = this.spec.style?.stroke ?? getPalette()[0];
    }

    return res;
  }
}
