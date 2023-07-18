import type { IBandLikeScale } from '@visactor/vscale';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import type {
  BasicEncoderSpecMap,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  IElement,
  IntervalEncodeChannels,
  Nil,
  ScaleSpec,
  ValueOf,
  WithDefaultEncode
} from '../types';
import { SemanticMark } from './semantic-mark';

export class Interval extends SemanticMark<BasicEncoderSpecMap['interval'], IntervalEncodeChannels> {
  constructor(id?: string | number) {
    super('interval', id);
  }

  setMarkType() {
    return 'rect';
  }

  parseScaleByEncode(
    channel: IntervalEncodeChannels,
    option: ValueOf<WithDefaultEncode<BasicEncoderSpecMap['interval'], IntervalEncodeChannels>, IntervalEncodeChannels>
  ): ScaleSpec | Nil {
    return this.parseScaleOfCommonEncode(channel, option);
  }

  convertMarkEncode(
    encode: WithDefaultEncode<BasicEncoderSpecMap['interval'], IntervalEncodeChannels>
  ): GenerateBaseEncodeSpec<BasicEncoderSpecMap['interval']> {
    const markEncoder = this.convertSimpleMarkEncode(encode);
    const scaleXId = this.generateScaleId('x');
    const scaleYId = this.generateScaleId('y');
    const xAccessor = getFieldAccessor(markEncoder.x.field);
    const res = {
      y: markEncoder.y,
      x: (datum: any, el: IElement, params: any) => {
        const scale = params[scaleXId];
        const bandWidth = (scale as IBandLikeScale).bandwidth();

        return scale.scale(xAccessor(datum)) + bandWidth / 4;
      },
      x1: (datum: any, el: IElement, params: any) => {
        const scale = params[scaleXId];
        const bandWidth = (scale as IBandLikeScale).bandwidth();

        return scale.scale(xAccessor(datum)) + bandWidth / 2;
      },
      y1: (datum: any, el: IElement, params: any) => {
        const scale = params[scaleYId];
        const domain = scale.domain();
        const min = Math.min.apply(null, domain);
        const max = Math.max.apply(null, domain);
        const baseValue = min > 0 ? min : max < 0 ? max : 0;

        return scale.scale(baseValue);
      }
    } as GenerateEncoderSpec<BasicEncoderSpecMap['rect']>;

    if (markEncoder.color || markEncoder.group) {
      res.fill = markEncoder.color ?? markEncoder.group;
    } else {
      res.fill = 'black';
    }

    return res;
  }
}
