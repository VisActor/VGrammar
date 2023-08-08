import type {
  TreemapEncodeChannels,
  WithDefaultEncode,
  PlotTreemapEncodeSpec,
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
import { getPalette, GrammarMarkType, getTransform, SIGNAL_VIEW_BOX } from '@visactor/vgrammar';
import { PlotMakType } from './enums';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import type { BaseLabelAttrs } from '@visactor/vrender-components';

export class TreemapSemanticMark extends SemanticMark<PlotTreemapEncodeSpec, TreemapEncodeChannels> {
  static readonly type = PlotMakType.treemap;
  constructor(id?: string | number) {
    super(PlotMakType.treemap, id);

    if (!getTransform('treemap')) {
      this._logger.error(
        `Please add this line of code: import { registerTreemapTransforms } from 'vgrammar-hierarchy'; 
        and run registerTreemapTransforms() before use treemap`
      );
    }
  }

  setMarkType() {
    return GrammarMarkType.rect;
  }

  setDefaultDataTranform(): TransformSpec[] {
    return [
      {
        type: 'treemap',
        width: { signal: 'viewWidth' },
        height: { signal: 'viewHeight' },
        nodeKey: this.spec.encode?.node,
        flatten: true
      }
    ];
  }
  parseScaleByEncode(
    channel: TreemapEncodeChannels,
    option: ValueOf<WithDefaultEncode<PlotTreemapEncodeSpec, TreemapEncodeChannels>, TreemapEncodeChannels>
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
    encode: WithDefaultEncode<PlotTreemapEncodeSpec, TreemapEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotTreemapEncodeSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res: GenerateEncoderSpec<PlotTreemapEncodeSpec> = {
      x: { field: 'x0' },
      x1: { field: 'x1' },
      y: { field: 'y0' },
      y1: { field: 'y1' }
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

  protected parseLabelSpec(): LabelSpec[] {
    // TODO use arc label in the future
    return [];
  }

  setMultiMarksSpec() {
    const label = this.spec.label;

    if (!label) {
      return null;
    }

    return Object.keys(label).map(key => {
      const textGetter = getFieldAccessor(key);
      return {
        id: `${this.getMarkId()}-text-${key}`,
        type: 'text',
        from: {
          data: this.getDataIdOfFiltered()
        },
        layout: {
          position: 'content',
          skipBeforeLayouted: true
        },
        key: 'flattenIndex',
        dependency: this.viewSpec.scales.map(scale => scale.id).concat(SIGNAL_VIEW_BOX),
        animation: this.convertMarkAnimation(),
        encode: {
          enter: Object.assign(
            {
              textAlign: 'center',
              textBaseline: 'middle'
            },
            (label[key] as Partial<BaseLabelAttrs>).textStyle
          ),
          update: (datum: any, el: IElement, params: any) => {
            return {
              x: datum.labelRect ? (datum.labelRect.x0 + datum.labelRect.x1) / 2 : (datum.x0 + datum.x1) / 2,
              y: datum.labelRect ? (datum.labelRect.y0 + datum.labelRect.y1) / 2 : (datum.y0 + datum.y1) / 2,
              text: textGetter(datum.datum[datum.datum.length - 1])
            };
          }
        }
      };
    });
  }
}
