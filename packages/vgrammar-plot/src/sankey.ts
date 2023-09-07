import type {
  SankeyEncodeChannels,
  WithDefaultEncode,
  PlotSankeyEncoderSpec,
  SemanticLabelOption,
  ChannelEncodeType,
  DataSpec,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  Nil,
  ScaleSpec,
  ValueOf,
  TransformSpec,
  IElement
} from '@visactor/vgrammar';
import { SemanticMark } from './semantic-mark';
// eslint-disable-next-line no-duplicate-imports
import { GrammarMarkType, SIGNAL_VIEW_BOX, Factory } from '@visactor/vgrammar';
import { PlotMakType } from './enums';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import type { ITextAttribute } from '@visactor/vrender';

export class SankeySemanticMark extends SemanticMark<PlotSankeyEncoderSpec, SankeyEncodeChannels> {
  static readonly type = PlotMakType.sankey;
  constructor(id?: string | number) {
    super(PlotMakType.sankey, id);

    if (!Factory.getTransform(PlotMakType.sankey)) {
      this._logger.error(
        `Please add this line of code: import { registerSankeyTransforms } from '@visactor/vgrammar-sankey'; 
        and run registerSankeyTransforms() before use sankey`
      );
    }

    if (!Factory.getGlyph('linkPath')) {
      this._logger.error(`
      Please add this line of code: import { registerLinkPathGlyph } from '@visactor/vgrammar';
      add run registerLinkPathGlyph() before use sankey
      `);
    }
  }

  setMarkType() {
    return GrammarMarkType.rect;
  }

  setDefaultDataTransform(): TransformSpec[] {
    return [
      {
        type: 'sankey',
        width: { signal: 'viewWidth' },
        height: { signal: 'viewHeight' },
        nodeKey: this.spec.encode?.node
      }
    ];
  }

  getDataIdOfLink() {
    return `${this.spec.data?.id ?? this.spec.id}-data-link`;
  }

  setMultipleData(): DataSpec[] {
    return [
      {
        id: this.getDataIdOfFiltered(),
        transform: [
          {
            type: 'map',
            all: true,
            callback: (datum: any) => {
              return datum[0].nodes;
            }
          }
        ]
      },
      {
        source: this.getDataIdOfMain(),
        id: this.getDataIdOfLink(),
        transform: [
          {
            type: 'map',
            all: true,
            callback: (datum: any) => {
              // return formatLinkPath(datum[0].links);
              return datum[0].links;
            }
          }
        ]
      }
    ];
  }

  parseScaleByEncode(
    channel: SankeyEncodeChannels,
    option: ValueOf<WithDefaultEncode<PlotSankeyEncoderSpec, SankeyEncodeChannels>, SankeyEncodeChannels>
  ): ScaleSpec | Nil {
    if (channel === 'color') {
      return {
        type: 'ordinal',
        id: this.getScaleId('color'),
        domain: {
          data: this.getDataIdOfFiltered(),
          field: option as string
        },
        range: this.getPalette()
      };
    }

    return null;
  }

  convertMarkEncode(
    encode: WithDefaultEncode<PlotSankeyEncoderSpec, SankeyEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotSankeyEncoderSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);

    const res: GenerateEncoderSpec<PlotSankeyEncoderSpec> = {
      x: { field: 'x0' },
      x1: { field: 'x1' },
      y: { field: 'y0' },
      y1: { field: 'y1' }
    };

    if (markEncoder.stroke) {
      res.stroke = markEncoder.stroke;
    }

    if (markEncoder.color) {
      const scaleColorId = this.getScaleId('color');
      const colorAccessor = getFieldAccessor(markEncoder.color.field);

      res.fill = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleColorId];
        return scale.scale(colorAccessor(datum?.datum));
      };
    } else {
      res.fill = this.spec.style?.nodeStyle?.fill ?? this.getPalette()?.[0];
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
      return textGetter(datum.datum);
    };
  }

  setMultiMarksSpec() {
    // TODO: optimize the default style
    return [
      {
        id: `${this.getMarkId()}-link`,
        type: 'glyph',
        glyphType: 'linkPath',
        from: {
          data: this.getDataIdOfLink()
        },
        layout: {
          position: 'content',
          skipBeforeLayouted: true
        },
        key: 'index',
        dependency: this.viewSpec.scales.map(scale => scale.id).concat(SIGNAL_VIEW_BOX),
        animation: this.convertMarkAnimation(),
        encode: Object.assign({}, this.spec.state, {
          enter: Object.assign(
            {
              backgroundStyle: { fillColor: '#ccc', fillOpacity: 0.2 },
              fillOpacity: 0.8,
              round: true
            },
            this.spec.style?.linkStyle
          ),
          update: (datum: any, el: IElement, params: any) => {
            return {
              direction: datum.vertical ? 'vertical' : 'horizontal',
              x0: datum.x0,
              x1: datum.x1,
              y0: datum.y0,
              y1: datum.y1,
              thickness: datum.thickness,
              fill: this.spec.style?.linkStyle?.fill ?? this.getPalette()?.[0]
            };
          }
        })
      }
    ];
  }
}
