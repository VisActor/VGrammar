import type { IBandLikeScale, IBaseScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { ScaleEnum } from '@visactor/vscale';
import { GrammarMarkType } from '../graph/enums';
import { invokeEncoder } from '../graph/mark/encode';
import { isScaleEncode } from '../parse/mark';
import { getGrammarOutput, isFunctionType } from '../parse/util';
import type {
  StateEncodeSpec,
  MarkSpec,
  IElement,
  BaseEncodeSpec,
  MarkFunctionType,
  IntervalChannelEncoderSpec,
  AttributeTransform
} from '../types';
import { Mark } from '../view/mark';
import { isNil } from '@visactor/vutils';
import { createGraphicItem } from '../graph/util/graphic';
import type { IPolarCoordinate } from '@visactor/vgrammar-coordinate';
import { transformsByType } from '../graph/attributes';

export class Interval extends Mark {
  declare markType: GrammarMarkType.interval;
  protected declare spec: MarkSpec;

  protected _encoders: StateEncodeSpec;

  encodeState(state: string, channel: string | BaseEncodeSpec, value?: MarkFunctionType<any>) {
    super.encodeState(state, channel, value);

    this._updateComponentEncoders(state);

    return this;
  }

  protected _updateComponentEncoders(state: string) {
    if (!this._encoders) {
      this._encoders = {};
    }

    const userEncoder = this.spec.encode[state] as IntervalChannelEncoderSpec;

    if (userEncoder && state === 'update') {
      const params = this.parameters();
      const scales: Record<string, IBaseScale> = isFunctionType(userEncoder)
        ? null
        : Object.keys(userEncoder).reduce((res, channel) => {
            if (isScaleEncode(userEncoder[channel])) {
              res[channel] = getGrammarOutput(userEncoder[channel].scale, params);
            }
            return res;
          }, {});

      this._encoders[state] = {
        callback: (datum: any, element: IElement, parameters: any) => {
          const userEncodeRes = invokeEncoder(userEncoder, datum, element, parameters);

          this.disableCoordinateTransform = false;
          if (scales && scales.x && scales.x.type === ScaleEnum.Band) {
            if (!isNil(scales.y)) {
              const domain = scales.y.domain();
              const min = Math.min.apply(null, domain);
              const max = Math.max.apply(null, domain);
              const baseValue = min > 0 ? min : max < 0 ? max : 0;

              userEncodeRes.y1 = scales.y.scale(baseValue);
            }
            const bandWidth = (scales.x as IBandLikeScale).bandwidth();

            // TODO: handle bandWidth dynamically
            userEncodeRes.x = userEncodeRes.x + bandWidth / 4;
            userEncodeRes.x1 = userEncodeRes.x + bandWidth / 2;
          } else if (scales && scales.y && scales.y.type === ScaleEnum.Band) {
            if (!isNil(scales.x)) {
              const domain = scales.x.domain();
              const min = Math.min.apply(null, domain);
              const max = Math.max.apply(null, domain);
              const baseValue = min > 0 ? min : max < 0 ? max : 0;

              userEncodeRes.x1 = scales.x.scale(baseValue);
            }
            const bandWidth = (scales.y as IBandLikeScale).bandwidth();

            userEncodeRes.y = userEncodeRes.y + bandWidth / 4;
            userEncodeRes.y1 = userEncodeRes.y + bandWidth / 2;
          }

          if (scales) {
            const scaleGrammar =
              this.view.getScaleById(userEncoder.x?.scale) ?? this.view.getScaleById(userEncoder.y?.scale);
            const coord = scaleGrammar.getCoordinate();

            if (coord && coord.type === 'polar') {
              this.disableCoordinateTransform = true;
              const origin = (coord as IPolarCoordinate).origin();
              userEncodeRes.cx = origin.x;
              userEncodeRes.cy = origin.y;
            }
          }

          return userEncodeRes;
        }
      };
    } else {
      this._encoders[state] = userEncoder;
    }
  }

  protected _getEncoders() {
    return this._encoders ?? {};
  }

  getAttributeTransforms() {
    if (this.coord && this.coord.output().type === 'polar') {
      return [
        {
          channels: ['x', 'y', 'x1', 'y1', 'cx', 'cy'],
          transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
            graphicAttributes.x = storedAttrs.cx;
            graphicAttributes.y = storedAttrs.cy;
            if (this.coord.output().isTransposed()) {
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
      ] as AttributeTransform[];
    }

    return transformsByType.rect;
  }

  addGraphicItem(attrs: any, groupKey?: string) {
    const graphicItem = createGraphicItem(
      this,
      this.coord && this.coord.output().type === 'polar' ? GrammarMarkType.arc : GrammarMarkType.rect,
      attrs
    );

    return super.addGraphicItem(attrs, groupKey, graphicItem);
  }

  release(): void {
    super.release();
    this._encoders = null;
  }
}
