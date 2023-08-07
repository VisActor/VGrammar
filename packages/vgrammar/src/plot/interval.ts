import type { IBandLikeScale } from '@visactor/vscale';
import { field as getFieldAccessor } from '@visactor/vgrammar-util';
import type {
  AttributeTransform,
  GenerateBaseEncodeSpec,
  GenerateEncoderSpec,
  IElement,
  IntervalEncodeChannels,
  Nil,
  PlotIntervalEncoderSpec,
  ScaleSpec,
  SemanticTooltipOption,
  TransformSpec,
  ValueOf,
  WithDefaultEncode
} from '../types';
import { SemanticMark } from './semantic-mark';
import type { CrosshairSpec } from '../types/component';
import { getPalette } from '../palette';
import type { IPolarCoordinate } from '@visactor/vgrammar-coordinate';
import { isArray } from '@visactor/vutils';
import { GrammarMarkType } from '../graph';
import { PlotMakType } from './enums';

export class Interval extends SemanticMark<PlotIntervalEncoderSpec, IntervalEncodeChannels> {
  static readonly type = PlotMakType.interval;
  constructor(id?: string | number) {
    super(PlotMakType.interval, id);
  }

  setMarkType() {
    return this._coordinate?.type === 'polar' ? GrammarMarkType.arc : GrammarMarkType.rect;
  }

  parseScaleByEncode(
    channel: IntervalEncodeChannels,
    option: ValueOf<WithDefaultEncode<PlotIntervalEncoderSpec, IntervalEncodeChannels>, IntervalEncodeChannels>
  ): ScaleSpec | Nil {
    return this.parseScaleOfCommonEncode(channel, option);
  }

  setDefaultTranform(): TransformSpec[] {
    return [
      {
        type: 'dodge',
        minWidth: this.spec.style?.minWidth,
        maxWidth: this.spec.style?.maxWidth,
        innerGap: this.spec.style?.innerGap,
        categoryGap: this.spec.style?.categoryGap
      }
    ];
  }

  setDefaultCorsshair(): Record<string, Pick<CrosshairSpec, 'crosshairShape' | 'crosshairType'>> {
    return {
      x: { crosshairShape: 'rect' }
    };
  }

  setDefaultTooltip(): SemanticTooltipOption | Nil {
    const encodeY = this.spec.encode?.y;
    return {
      content: isArray(encodeY)
        ? encodeY.map(entry => {
            return {
              value: entry
            };
          })
        : [
            {
              value: encodeY
            }
          ]
    };
  }

  setMainMarkSpec() {
    return this._coordinate?.type === 'polar'
      ? {
          attributeTransforms: [
            {
              channels: ['x', 'y', 'x1', 'y1', 'cx', 'cy'],
              transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
                graphicAttributes.x = storedAttrs.cx;
                graphicAttributes.y = storedAttrs.cy;
                if (this._coordinate.transpose) {
                  graphicAttributes.startAngle = storedAttrs.y;
                  graphicAttributes.endAngle = storedAttrs.y1;
                  graphicAttributes.innerRadius = storedAttrs.x;
                  graphicAttributes.outerRadius = storedAttrs.x1;
                } else {
                  //
                  graphicAttributes.startAngle = storedAttrs.x;
                  graphicAttributes.endAngle = storedAttrs.x1;
                  graphicAttributes.innerRadius = storedAttrs.y;
                  graphicAttributes.outerRadius = storedAttrs.y1;
                }
              },
              storedAttrs: 'sizeAttrs'
            }
          ] as AttributeTransform[]
        }
      : {};
  }

  convertMarkEncode(
    encode: WithDefaultEncode<PlotIntervalEncoderSpec, IntervalEncodeChannels>
  ): GenerateBaseEncodeSpec<PlotIntervalEncoderSpec> {
    const markEncoder = this.convertSimpleMarkEncode(encode);
    const scaleXId = this.getScaleId('x');
    const scaleYId = this.getScaleId('y');
    const xAccessor = getFieldAccessor(markEncoder.x.field);
    const res: GenerateEncoderSpec<PlotIntervalEncoderSpec> = {
      x: (datum: any, el: IElement, params: any) => {
        const scale = params[scaleXId];
        const bandWidth = (scale as IBandLikeScale).bandwidth();

        return scale.scale(xAccessor(datum)) + bandWidth / 4;
      },
      x1: (datum: any, el: IElement, params: any) => {
        const scale = params[scaleXId];
        const bandWidth = (scale as IBandLikeScale).bandwidth();

        return scale.scale(xAccessor(datum)) + (3 * bandWidth) / 4;
      }
    };

    if (isArray(markEncoder.y?.field)) {
      res.y = { field: markEncoder.y.field[0], scale: markEncoder.y.scale };
      res.y1 = { field: markEncoder.y.field[1], scale: markEncoder.y.scale };
    } else {
      const yAccessor = getFieldAccessor(markEncoder.y.field);
      res.y = (datum: any, el: IElement, params: any) => {
        const yVals = yAccessor(datum);
        const scale = params[scaleYId];

        return isArray(yVals) ? scale.scale(yVals[0]) : scale.scale(yVals);
      };
      res.y1 = (datum: any, el: IElement, params: any) => {
        const scale = params[scaleYId];
        const yVals = yAccessor(datum);

        if (isArray(yVals) && yVals.length > 1) {
          return scale.scale(yVals[1]);
        }
        const domain = scale.domain();
        const min = Math.min.apply(null, domain);
        const max = Math.max.apply(null, domain);
        const baseValue = min > 0 ? min : max < 0 ? max : 0;

        return scale.scale(baseValue);
      };
    }

    if (markEncoder.color || markEncoder.group) {
      res.fill = markEncoder.color ?? markEncoder.group;
    } else {
      res.fill = this.spec.style?.fill ?? getPalette()[0];
    }

    if (this._coordinate?.type === 'polar') {
      (res as any).cx = (datum: any, el: IElement, params: any) => {
        const coord = params[this._coordinate.id];
        const origin = (coord as IPolarCoordinate).origin();

        return origin.x;
      };
      (res as any).cy = (datum: any, el: IElement, params: any) => {
        const coord = params[this._coordinate.id];
        const origin = (coord as IPolarCoordinate).origin();

        return origin.y;
      };
    }

    return res;
  }
}
