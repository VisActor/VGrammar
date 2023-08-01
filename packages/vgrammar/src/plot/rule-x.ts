import type {
  BasicEncoderSpecMap,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  RuleXEncodeChannels,
  Nil,
  ScaleSpec,
  ValueOf,
  WithDefaultEncode,
  IElement
} from '../types';
import { SemanticMark } from './semantic-mark';
import { getPalette } from '../palette';

export class RuleX extends SemanticMark<BasicEncoderSpecMap['rule'], RuleXEncodeChannels> {
  static readonly type = 'ruleX';
  constructor(id?: string | number) {
    super('ruleX', id);
  }

  setMarkType() {
    return 'rule';
  }

  protected parseScaleOfEncodeX(
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['rule'], RuleXEncodeChannels>, RuleXEncodeChannels>
  ): ScaleSpec | Nil {
    const res = super.parseScaleOfEncodeX(option);

    res.type = 'point';
    return res;
  }

  parseScaleByEncode(
    channel: RuleXEncodeChannels,
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['rule'], RuleXEncodeChannels>, RuleXEncodeChannels>
  ): ScaleSpec | Nil {
    return this.parseScaleOfCommonEncode(channel, option);
  }

  convertMarkEncode(
    encode: WithDefaultEncode<BasicEncoderSpecMap['rule'], RuleXEncodeChannels>
  ): GenerateBaseEncodeSpec<BasicEncoderSpecMap['rule']> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res = {
      x: markEncoder.x,
      x1: markEncoder.x,
      y: (datum: any, el: IElement, params: any) => {
        return 0;
      },
      y1: (datum: any, el: IElement, params: any) => {
        return params.viewBox.height();
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
