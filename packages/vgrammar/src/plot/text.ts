import type {
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  TextEncodeChannels,
  Nil,
  ScaleSpec,
  ValueOf,
  WithDefaultEncode,
  BasicEncoderSpecMap
} from '../types';
import { SemanticMark } from './semantic-mark';
import { getPalette } from '../palette';
import { PlotMakType } from './enums';
import { GrammarMarkType } from '../graph';

export class TextSemanticMark extends SemanticMark<BasicEncoderSpecMap['text'], TextEncodeChannels> {
  static readonly type = PlotMakType.text;
  constructor(id?: string | number) {
    super(PlotMakType.text, id);
  }

  setMarkType() {
    return GrammarMarkType.text;
  }

  protected parseScaleOfEncodeX(
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['text'], TextEncodeChannels>, TextEncodeChannels>
  ): ScaleSpec | Nil {
    const res = super.parseScaleOfEncodeX(option);

    res.type = 'point';
    return res;
  }

  parseScaleByEncode(
    channel: TextEncodeChannels,
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['text'], TextEncodeChannels>, TextEncodeChannels>
  ): ScaleSpec | Nil {
    return this.parseScaleOfCommonEncode(channel, option);
  }

  convertMarkEncode(
    encode: WithDefaultEncode<BasicEncoderSpecMap['text'], TextEncodeChannels>
  ): GenerateBaseEncodeSpec<BasicEncoderSpecMap['text']> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res: GenerateEncoderSpec<BasicEncoderSpecMap['text']> = markEncoder;

    if (markEncoder.color || markEncoder.group) {
      res.fill = markEncoder.color ?? markEncoder.group;
    } else {
      res.fill = this.spec.style?.fill ?? getPalette()[0];
    }

    return res;
  }
}
