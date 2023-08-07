import { GrammarMarkType } from '../graph';
import type {
  GenerateBaseEncodeSpec,
  PathEncodeChannels,
  Nil,
  ScaleSpec,
  ValueOf,
  WithDefaultEncode,
  BasicEncoderSpecMap
} from '../types';
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
    return null;
  }
}
