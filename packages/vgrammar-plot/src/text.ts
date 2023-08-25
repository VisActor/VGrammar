import type {
  TextEncodeChannels,
  WithDefaultEncode,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  Nil,
  ScaleSpec,
  ValueOf,
  BasicEncoderSpecMap,
  FieldEncodeType
} from '@visactor/vgrammar';
import { SemanticMark } from './semantic-mark';
// eslint-disable-next-line no-duplicate-imports
import { GrammarMarkType } from '@visactor/vgrammar';
import { PlotMakType } from './enums';

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

    if (res.text) {
      res.text = { field: (res.text as FieldEncodeType).field };
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
