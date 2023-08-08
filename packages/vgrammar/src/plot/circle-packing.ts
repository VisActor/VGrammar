import type {
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  CirclepackingEncodeChannels,
  Nil,
  ScaleSpec,
  ValueOf,
  WithDefaultEncode,
  PlotCirclePackingEncodeSpec,
  TransformSpec,
  IElement,
  SemanticLabelOption,
  ChannelEncodeType
} from '../types';
import { SemanticMark } from './semantic-mark';
import { getPalette } from '../palette';
import { PlotMakType } from './enums';
import { GrammarMarkType } from '../graph';
import { getTransform } from '../transforms/register';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import type { ITextAttribute } from '@visactor/vrender';

export class CirclePackingSemanticMark extends SemanticMark<PlotCirclePackingEncodeSpec, CirclepackingEncodeChannels> {
  static readonly type = PlotMakType.circlePacking;
  constructor(id?: string | number) {
    super(PlotMakType.circlePacking, id);

    if (!getTransform(PlotMakType.circlePacking)) {
      this._logger.error(
        `Please add this line of code: import { registerCirclePackingTransforms } from '@visactor/vgrammar-hierarchy'; 
        and run registerCirclePackingTransforms() before use treemap chart`
      );
    }
  }

  setMarkType() {
    return GrammarMarkType.circle;
  }

  setDefaultDataTranform(): TransformSpec[] {
    return [
      {
        type: PlotMakType.circlePacking,
        width: { signal: 'viewWidth' },
        height: { signal: 'viewHeight' },
        nodeKey: this.spec.encode?.node,
        flatten: true
      }
    ];
  }
  parseScaleByEncode(
    channel: CirclepackingEncodeChannels,
    option: ValueOf<
      WithDefaultEncode<PlotCirclePackingEncodeSpec, CirclepackingEncodeChannels>,
      CirclepackingEncodeChannels
    >
  ): ScaleSpec | Nil {
    if (channel === 'color') {
      return {
        type: 'ordinal',
        id: this.getScaleId('color'),
        domain: {
          data: this.getDataIdOfFiltered(),
          field: option as string
        },
        range: getPalette()
      };
    }

    return null;
  }

  convertMarkEncode(
    encode: WithDefaultEncode<PlotCirclePackingEncodeSpec, CirclepackingEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotCirclePackingEncodeSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res: GenerateEncoderSpec<PlotCirclePackingEncodeSpec> = {
      x: { field: 'x' },
      y: { field: 'y' },
      radius: { field: 'radius' }
    };

    if (markEncoder.color) {
      const scaleColorId = this.getScaleId('color');
      const colorAccessor = getFieldAccessor(markEncoder.color.field);

      res.fill = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleColorId];
        return datum?.datum ? scale.scale(colorAccessor(datum.datum[datum.datum.length - 1])) : undefined;
      };
    } else {
      res.fill = this.spec.style?.fill ?? getPalette()[0];
    }

    return res;
  }

  setMainMarkSpec() {
    return { key: 'key' };
  }

  protected setLabelTextGetter(
    channel: string,
    option: SemanticLabelOption | boolean
  ): ChannelEncodeType<ITextAttribute['text']> {
    const textGetter = getFieldAccessor(channel);
    return (datum: any, el: IElement, params: any) => {
      return textGetter(datum.datum[datum.datum.length - 1]);
    };
  }
}
