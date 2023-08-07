import type {
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  SymbolEncodeChannels,
  Nil,
  ScaleSpec,
  ValueOf,
  WithDefaultEncode,
  BasicEncoderSpecMap,
  ScaleFunctionType
} from '../types';
import { SemanticMark } from './semantic-mark';
import { getPalette } from '../palette';
import { PlotMakType } from './enums';
import { GrammarMarkType } from '../graph';

export class SymbolSemanticMark extends SemanticMark<BasicEncoderSpecMap['symbol'], SymbolEncodeChannels> {
  static defaultSpec: BasicEncoderSpecMap['symbol'] = {
    size: 10
  };
  static readonly type = PlotMakType.symbol;
  constructor(id?: string | number) {
    super(PlotMakType.symbol, id);
  }

  setMarkType() {
    return GrammarMarkType.symbol;
  }

  protected parseScaleOfEncodeX(
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['symbol'], SymbolEncodeChannels>, SymbolEncodeChannels>
  ): ScaleSpec | Nil {
    const res = super.parseScaleOfEncodeX(option);

    res.type = 'point';
    return res;
  }

  parseScaleByEncode(
    channel: SymbolEncodeChannels,
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['symbol'], SymbolEncodeChannels>, SymbolEncodeChannels>
  ): ScaleSpec | Nil {
    if (channel === 'size') {
      return {
        type: 'linear',
        id: this.getScaleId('size'),
        domain: {
          data: this.getDataIdOfFiltered(),
          field: option as string
        },
        range: [SymbolSemanticMark.defaultSpec.size, SymbolSemanticMark.defaultSpec.size] as ScaleFunctionType<number[]>
      };
    }

    if (channel === 'shape') {
      return {
        type: 'ordinal',
        id: this.getScaleId('shape'),
        domain: {
          data: this.getDataIdOfMain(),
          field: option as string
        }
      };
    }

    return this.parseScaleOfCommonEncode(channel, option);
  }

  convertMarkEncode(
    encode: WithDefaultEncode<BasicEncoderSpecMap['symbol'], SymbolEncodeChannels>
  ): GenerateBaseEncodeSpec<BasicEncoderSpecMap['symbol']> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res: GenerateEncoderSpec<BasicEncoderSpecMap['symbol']> = {
      x: markEncoder.x,
      y: markEncoder.y
    };

    if (markEncoder.shape) {
      res.symbolType = markEncoder.shape;
    }

    if (markEncoder.size) {
      res.size = markEncoder.size;
    }

    if (markEncoder.color || markEncoder.group) {
      res.fill = markEncoder.color ?? markEncoder.group;
    } else {
      res.fill = this.spec.style?.fill ?? getPalette()[0];
    }

    return res;
  }
}
