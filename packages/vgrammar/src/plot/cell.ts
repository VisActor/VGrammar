import type {
  BasicEncoderSpecMap,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  CellEncodeChannels,
  Nil,
  ScaleSpec,
  SemanticTooltipOption,
  ValueOf,
  WithDefaultEncode
} from '../types';
import { SemanticMark } from './semantic-mark';
import type { CrosshairSpec } from '../types/component';
import { getPalette } from '../palette';

export class Cell extends SemanticMark<BasicEncoderSpecMap['cell'], CellEncodeChannels> {
  static readonly type = 'cell';
  constructor(id?: string | number) {
    super('cell', id);
  }

  setMarkType() {
    return 'cell';
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

  setDefaultCorsshair(): Record<string, Pick<CrosshairSpec, 'crosshairShape' | 'crosshairType'>> {
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

    if (markEncoder.color || markEncoder.group) {
      res.stroke = markEncoder.color ?? markEncoder.group;
    } else {
      res.stroke = this.spec.style?.fill ?? getPalette()[0];
    }

    return res;
  }
}
