import type {
  BasicEncoderSpecMap,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  LineEncodeChannels,
  Nil,
  ScaleSpec,
  SemanticTooltipOption,
  ValueOf,
  WithDefaultEncode
} from '../types';
import { SemanticMark } from './semantic-mark';
import type { CrosshairSpec } from '../types/component';
import { getPalette } from '../palette';

export class Line extends SemanticMark<BasicEncoderSpecMap['line'], LineEncodeChannels> {
  constructor(id?: string | number) {
    super('line', id);
  }

  setMarkType() {
    return 'line';
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
      res.stroke = getPalette()[0];
    }

    return res;
  }
}
