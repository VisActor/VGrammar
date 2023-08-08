import type {
  WordcloudShapeEncodeChannels,
  WithDefaultEncode,
  PlotWordcloudShapeEncodeSpec,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  Nil,
  ScaleSpec,
  ValueOf,
  TransformSpec,
  IElement,
  LabelSpec
} from '@visactor/vgrammar';
import { SemanticMark } from './semantic-mark';
import { getPalette, GrammarMarkType, getTransform } from '@visactor/vgrammar';
import { PlotMakType } from './enums';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';

export class WordcloudShapeSemanticMark extends SemanticMark<
  PlotWordcloudShapeEncodeSpec,
  WordcloudShapeEncodeChannels
> {
  static readonly type = PlotMakType.wordcloudShape;
  constructor(id?: string | number) {
    super(PlotMakType.wordcloudShape, id);

    if (!getTransform(PlotMakType.wordcloudShape)) {
      this._logger.error(
        `Please add this line of code:
          import { registerWordCloudShapeTransforms } from '@visactor/vgrammar-wordcloud-shape'; 
        and run registerWordCloudShapeTransforms() before use wordcloud-shape`
      );
    }
  }

  setMarkType() {
    return GrammarMarkType.text;
  }

  setDefaultDataTranform(): TransformSpec[] {
    return [
      {
        type: 'wordcloudShape',
        size: {
          callback: (params: any) => {
            return [params.viewBox.width(), params.viewBox.height()];
          },
          dependency: ['viewBox']
        },
        colorList: getPalette(),
        text: { field: this.spec.encode?.text }
      }
    ];
  }

  parseScaleByEncode(
    channel: WordcloudShapeEncodeChannels,
    option: ValueOf<
      WithDefaultEncode<PlotWordcloudShapeEncodeSpec, WordcloudShapeEncodeChannels>,
      WordcloudShapeEncodeChannels
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
    encode: WithDefaultEncode<PlotWordcloudShapeEncodeSpec, WordcloudShapeEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotWordcloudShapeEncodeSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res: GenerateEncoderSpec<PlotWordcloudShapeEncodeSpec> = {
      x: { field: 'x' },
      y: { field: 'y' },
      angle: { field: 'angle' },
      fontSize: { field: 'fontSize' },
      fontStyle: { field: 'fontStyle' },
      fontFamily: { field: 'fontFamily' },
      fontWeight: { field: 'fontWeight' },
      fillOpacity: { field: 'opacity' },
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
