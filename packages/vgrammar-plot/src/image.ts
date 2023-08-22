import { SemanticMark } from './semantic-mark';
import type {
  ImageEncodeChannels,
  WithDefaultEncode,
  PlotImageEncoderSpec,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  IElement,
  Nil,
  ScaleSpec,
  ValueOf
} from '@visactor/vgrammar';
// eslint-disable-next-line no-duplicate-imports
import { GrammarMarkType } from '@visactor/vgrammar';
import { isArray } from '@visactor/vutils';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import { PlotMakType } from './enums';

export class ImageSemanticMark extends SemanticMark<PlotImageEncoderSpec, ImageEncodeChannels> {
  static readonly type = PlotMakType.image;
  static defaultSpec: PlotImageEncoderSpec = { width: 10, height: 10 };
  constructor(id?: string | number) {
    super(PlotMakType.image, id);
  }

  setMarkType() {
    return GrammarMarkType.image;
  }

  protected parseScaleOfEncodeX(
    option: ValueOf<WithDefaultEncode<PlotImageEncoderSpec, ImageEncodeChannels>, ImageEncodeChannels>
  ): ScaleSpec | Nil {
    const res = super.parseScaleOfEncodeX(option);

    res.type = 'point';
    return res;
  }

  parseScaleByEncode(
    channel: ImageEncodeChannels,
    option: ValueOf<WithDefaultEncode<PlotImageEncoderSpec, ImageEncodeChannels>, ImageEncodeChannels>
  ): ScaleSpec | Nil {
    if (channel === 'src') {
      return {
        type: 'ordinal',
        id: this.getScaleId('src'),
        domain: {
          data: this.getDataIdOfMain(),
          field: option as string
        }
      };
    }

    return this.parseScaleOfCommonEncode(channel, option);
  }

  convertMarkEncode(
    encode: WithDefaultEncode<PlotImageEncoderSpec, ImageEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotImageEncoderSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);
    const scaleXId = this.getScaleId('x');
    const scaleYId = this.getScaleId('y');
    const res: GenerateEncoderSpec<PlotImageEncoderSpec> = {
      image: markEncoder.src
    };

    if (markEncoder.src) {
      res.image = markEncoder.src;
    }

    if (isArray(markEncoder.x?.field)) {
      const xAccessor = getFieldAccessor(markEncoder.x.field[0]);
      const x1Accessor = getFieldAccessor(markEncoder.x.field[1]);
      res.x = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleXId];

        return Math.min(scale.scale(xAccessor(datum)), scale.scale(x1Accessor(datum)));
      };
      res.width = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleXId];

        return Math.abs(scale.scale(xAccessor(datum)) - scale.scale(x1Accessor(datum)));
      };
    } else {
      const width = this.spec.style?.width ?? ImageSemanticMark.defaultSpec.width;
      const xAccessor = getFieldAccessor(markEncoder.x.field);

      res.x = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleXId];

        return scale.scale(xAccessor(datum)) - width / 2;
      };
      res.width = width;
    }

    if (isArray(markEncoder.y?.field)) {
      const yAccessor = getFieldAccessor(markEncoder.y.field[0]);
      const y1Accessor = getFieldAccessor(markEncoder.y.field[1]);
      res.y = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleYId];

        return Math.min(scale.scale(yAccessor(datum)), scale.scale(y1Accessor(datum)));
      };
      res.height = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleYId];

        return Math.abs(scale.scale(yAccessor(datum)) - scale.scale(y1Accessor(datum)));
      };
    } else {
      const height = this.spec.style?.height ?? ImageSemanticMark.defaultSpec.height;
      const yAccessor = getFieldAccessor(markEncoder.y.field);

      res.y = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleXId];

        return scale.scale(yAccessor(datum)) - height / 2;
      };
      res.height = height;
    }

    if (markEncoder.stroke) {
      res.stroke = markEncoder.stroke;
    }

    if (markEncoder.color || markEncoder.group) {
      res.fill = markEncoder.color ?? markEncoder.group;
    } else {
      res.fill = this.spec.style?.fill ?? this.getPalette()?.[0];
    }

    return res;
  }
}
