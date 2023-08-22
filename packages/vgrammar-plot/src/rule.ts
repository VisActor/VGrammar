import type {
  RuleEncodeChannels,
  WithDefaultEncode,
  PlotRuleEncoderSpec,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  Nil,
  ScaleSpec,
  ValueOf
} from '@visactor/vgrammar';
import { SemanticMark } from './semantic-mark';
// eslint-disable-next-line no-duplicate-imports
import { GrammarMarkType } from '@visactor/vgrammar';
import { isArray } from '@visactor/vutils';
import { PlotMakType } from './enums';

export class Rule extends SemanticMark<PlotRuleEncoderSpec, RuleEncodeChannels> {
  static readonly type = PlotMakType.rule;
  constructor(id?: string | number) {
    super(PlotMakType.rule, id);
  }

  setMarkType() {
    return GrammarMarkType.rule;
  }

  protected parseScaleOfEncodeX(
    option: ValueOf<WithDefaultEncode<PlotRuleEncoderSpec, RuleEncodeChannels>, RuleEncodeChannels>
  ): ScaleSpec | Nil {
    const res = super.parseScaleOfEncodeX(option);

    res.type = 'point';
    return res;
  }

  parseScaleByEncode(
    channel: RuleEncodeChannels,
    option: ValueOf<WithDefaultEncode<PlotRuleEncoderSpec, RuleEncodeChannels>, RuleEncodeChannels>
  ): ScaleSpec | Nil {
    return this.parseScaleOfCommonEncode(channel, option);
  }

  convertMarkEncode(
    encode: WithDefaultEncode<PlotRuleEncoderSpec, RuleEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotRuleEncoderSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    let res: GenerateEncoderSpec<PlotRuleEncoderSpec>;

    if (isArray(markEncoder.x?.field)) {
      res.x = { field: markEncoder.x.field[0], scale: markEncoder.x.scale };
      res.x1 = { field: markEncoder.x.field[1], scale: markEncoder.x.scale };
    } else {
      res.x = res.x1 = markEncoder.x;
    }

    if (isArray(markEncoder.y?.field)) {
      res.y = { field: markEncoder.y.field[0], scale: markEncoder.y.scale };
      res.y1 = { field: markEncoder.y.field[1], scale: markEncoder.y.scale };
    } else {
      res.y = res.y1 = markEncoder.y;
    }

    if (markEncoder.color || markEncoder.group) {
      res.stroke = markEncoder.color ?? markEncoder.group;
    } else {
      res.stroke = this.spec.style?.stroke ?? this.getPalette()?.[0];
    }

    return res;
  }
}
