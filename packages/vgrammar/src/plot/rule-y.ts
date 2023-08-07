import type {
  BasicEncoderSpecMap,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  RuleYEncodeChannels,
  Nil,
  ScaleSpec,
  ValueOf,
  WithDefaultEncode,
  IElement
} from '../types';
import { SemanticMark } from './semantic-mark';
import { getPalette } from '../palette';
import { GrammarMarkType } from '../graph';
import { PlotMakType } from './enums';

export class RuleY extends SemanticMark<BasicEncoderSpecMap['rule'], RuleYEncodeChannels> {
  static readonly type = PlotMakType.ruleX;
  constructor(id?: string | number) {
    super(PlotMakType.ruleX, id);
  }

  setMarkType() {
    return GrammarMarkType.rule;
  }

  protected parseScaleOfEncodeX(
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['rule'], RuleYEncodeChannels>, RuleYEncodeChannels>
  ): ScaleSpec | Nil {
    const res = super.parseScaleOfEncodeX(option);

    res.type = 'point';
    return res;
  }

  parseScaleByEncode(
    channel: RuleYEncodeChannels,
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['rule'], RuleYEncodeChannels>, RuleYEncodeChannels>
  ): ScaleSpec | Nil {
    return this.parseScaleOfCommonEncode(channel, option);
  }

  convertMarkEncode(
    encode: WithDefaultEncode<BasicEncoderSpecMap['rule'], RuleYEncodeChannels>
  ): GenerateBaseEncodeSpec<BasicEncoderSpecMap['rule']> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res = {
      y: markEncoder.y,
      y1: markEncoder.y,
      x: (datum: any, el: IElement, params: any) => {
        return 0;
      },
      x1: (datum: any, el: IElement, params: any) => {
        return params.viewBox.width();
      }
    } as GenerateEncoderSpec<BasicEncoderSpecMap['rule']>;

    if (markEncoder.color || markEncoder.group) {
      res.stroke = markEncoder.color ?? markEncoder.group;
    } else {
      res.stroke = this.spec.style?.stroke ?? getPalette()[0];
    }

    return res;
  }
}
