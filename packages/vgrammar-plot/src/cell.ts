import type {
  BasicEncoderSpecMap,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  Nil,
  ScaleSpec,
  ValueOf,
  CrosshairSpec,
  CellEncodeChannels,
  SemanticTooltipOption,
  WithDefaultEncode
} from '@visactor/vgrammar';
import { SemanticMark } from './semantic-mark';
// eslint-disable-next-line no-duplicate-imports
import { GrammarMarkType } from '@visactor/vgrammar';
import { PlotMakType } from './enums';

export class Cell extends SemanticMark<BasicEncoderSpecMap['cell'], CellEncodeChannels> {
  static readonly type = PlotMakType.cell;
  constructor(id?: string | number) {
    super(PlotMakType.cell, id);
  }

  setMarkType() {
    return GrammarMarkType.cell;
  }

  protected parseScaleOfEncodeX(
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['cell'], CellEncodeChannels>, CellEncodeChannels>
  ): ScaleSpec | Nil {
    const res = super.parseScaleOfEncodeX(option);

    res.type = 'point';
    return res;
  }

  parseScaleByEncode(
    channel: CellEncodeChannels,
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['cell'], CellEncodeChannels>, CellEncodeChannels>
  ): ScaleSpec | Nil {
    return this.parseScaleOfCommonEncode(channel, option);
  }

  setDefaultCrosshair(): Record<string, Pick<CrosshairSpec, 'crosshairShape' | 'crosshairType'>> {
    return {
      x: { crosshairShape: 'line' }
    };
  }

  setDefaultTooltip(): SemanticTooltipOption | Nil {
    return {
      title: this.spec.encode?.x,
      content: [
        {
          value: this.spec.encode?.y
        }
      ]
    };
  }

  convertMarkEncode(
    encode: WithDefaultEncode<BasicEncoderSpecMap['cell'], CellEncodeChannels>
  ): GenerateBaseEncodeSpec<BasicEncoderSpecMap['cell']> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res = {
      y: markEncoder.y,
      x: markEncoder.x
    } as GenerateEncoderSpec<BasicEncoderSpecMap['cell']>;

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
