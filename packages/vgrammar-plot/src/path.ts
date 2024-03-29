import { GrammarMarkType } from '@visactor/vgrammar-core';
import type {
  PathEncodeChannels,
  WithDefaultEncode,
  BasicEncoderSpecMap,
  GenerateBaseEncodeSpec,
  Nil,
  ScaleSpec,
  ValueOf,
  GenerateEncoderSpec
} from '@visactor/vgrammar-core';
import { PlotMakType } from './enums';
import { SemanticMark } from './semantic-mark';

export class PathSemanticMark extends SemanticMark<BasicEncoderSpecMap['path'], PathEncodeChannels> {
  static readonly type = PlotMakType.path;
  constructor(id?: string | number) {
    super(PlotMakType.path, id);
  }

  setMarkType() {
    return GrammarMarkType.path;
  }
  parseScaleByEncode(
    channel: PathEncodeChannels,
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['path'], PathEncodeChannels>, PathEncodeChannels>
  ): ScaleSpec | Nil {
    return null;
  }

  convertMarkEncode(
    encode: WithDefaultEncode<BasicEncoderSpecMap['path'], PathEncodeChannels>
  ): GenerateBaseEncodeSpec<BasicEncoderSpecMap['path']> {
    const markEncoder = this.convertSimpleMarkEncode(encode);
    const res: GenerateEncoderSpec<BasicEncoderSpecMap['path']> = {};

    if (markEncoder.stroke) {
      res.stroke = markEncoder.stroke;
    }
    res.fill = markEncoder.color ?? this.spec.style?.fill ?? this.getPalette()?.[0];

    return null;
  }
}
