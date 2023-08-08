import type {
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  WordcloudEncodeChannels,
  Nil,
  ScaleSpec,
  ValueOf,
  WithDefaultEncode,
  PlotWordcloudEncodeSpec,
  TransformSpec,
  IElement,
  LabelSpec
} from '../types';
import { SemanticMark } from './semantic-mark';
import { getPalette } from '../palette';
import { PlotMakType } from './enums';
import { GrammarMarkType } from '../graph';
import { getTransform } from '../transforms/register';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';

export class WordcloudSemanticMark extends SemanticMark<PlotWordcloudEncodeSpec, WordcloudEncodeChannels> {
  static readonly type = PlotMakType.wordcloud;
  constructor(id?: string | number) {
    super(PlotMakType.wordcloud, id);

    if (!getTransform(PlotMakType.wordcloud)) {
      this._logger.error(
        `Please add this line of code:
         'import { registerWordCloudTransforms } from '@visactor/vgrammar-wordcloud'; 
        and run registerWordCloudTransforms() before use wordcloud`
      );
    }
  }

  setMarkType() {
    return GrammarMarkType.text;
  }

  setDefaultMarkTranform(): TransformSpec[] {
    return [
      {
        type: 'wordcloud',
        size: {
          callback: (params: any) => {
            return [params.viewBox.width(), params.viewBox.height()];
          },
          dependency: ['viewBox']
        },
        text: { field: this.spec.encode?.text }
      }
    ];
  }
  parseScaleByEncode(
    channel: WordcloudEncodeChannels,
    option: ValueOf<WithDefaultEncode<PlotWordcloudEncodeSpec, WordcloudEncodeChannels>, WordcloudEncodeChannels>
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
    encode: WithDefaultEncode<PlotWordcloudEncodeSpec, WordcloudEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotWordcloudEncodeSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res: GenerateEncoderSpec<PlotWordcloudEncodeSpec> = {
      x: { field: 'x' },
      y: { field: 'y' },
      angle: { field: 'angle' },
      fontSize: { field: 'fontSize' },
      fontStyle: { field: 'fontStyle' },
      fontFamily: { field: 'fontFamily' },
      fontWeight: { field: 'fontWeight' },
      text: { field: this.spec.encode?.text }
    };

    if (markEncoder.color) {
      const scaleColorId = this.getScaleId('color');
      const colorAccessor = getFieldAccessor(markEncoder.color.field);

      res.fill = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleColorId];
        return scale.scale(colorAccessor(datum));
      };
    } else {
      res.fill = this.spec.style?.fill ?? getPalette()[0];
    }

    return res;
  }

  protected parseLabelSpec(): LabelSpec[] {
    return [];
  }
}
