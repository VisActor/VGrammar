import type { IBaseScale } from '@visactor/vscale';
import type { GrammarMarkType } from '../graph/enums';
import { getBandWidthOfScale, invokeEncoder } from '../graph/mark/encode';
import { isScaleEncode } from '../parse/mark';
import { getGrammarOutput, isFunctionType } from '../parse/util';
import type {
  StateEncodeSpec,
  MarkSpec,
  IElement,
  MarkFunctionType,
  AttributeTransform,
  GetSignleEncodeSpecByType,
  BaseSignleEncodeSpec
} from '../types';
import { Mark } from '../view/mark';
import { isArray, isNil, isNumber } from '@visactor/vutils';
import { transformsByType } from '../graph/attributes';

export class Cell extends Mark {
  declare markType: GrammarMarkType.cell;
  protected declare spec: MarkSpec;

  protected _encoders: StateEncodeSpec | null;

  encodeState(state: string, channel: string | BaseSignleEncodeSpec, value?: MarkFunctionType<any>) {
    super.encodeState(state, channel, value);

    this._updateComponentEncoders(state);

    return this;
  }

  protected _updateComponentEncoders(state: string) {
    if (!this._encoders) {
      this._encoders = {};
    }

    const userEncoder = this.spec.encode[state] as GetSignleEncodeSpecByType<'cell'>;

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

          if (isNil(userEncodeRes.size)) {
            const sizeX = scales.x ? getBandWidthOfScale(scales.x) : undefined;
            const sizeY = scales.y ? getBandWidthOfScale(scales.y) : undefined;

            if (isNil(sizeX) && isNil(sizeY)) {
              userEncodeRes.size = 10;
            } else if (isNil(sizeX)) {
              userEncodeRes.size = sizeY;
            } else if (isNil(sizeY)) {
              userEncodeRes.size = sizeX;
            }

            userEncodeRes.size = [sizeX, sizeY];
          }

          if (isNil(userEncodeRes.shape)) {
            userEncodeRes.shape = 'rect';
          }

          return userEncodeRes;
        }
      } as GetSignleEncodeSpecByType<'cell'>;
    } else {
      this._encoders[state] = userEncoder;
    }
  }

  protected _getEncoders() {
    return this._encoders ?? {};
  }

  getAttributeTransforms() {
    return (
      [
        {
          channels: ['size', 'padding'],
          transform: (graphicAttributes: any, nextAttrs: any, storedAttrs: any) => {
            if (isNumber(storedAttrs.padding) && storedAttrs.padding > 0) {
              graphicAttributes.size = isArray(storedAttrs.size)
                ? storedAttrs.size.map((entry: number) => Math.max(entry - storedAttrs.padding, 1))
                : Math.max(storedAttrs.size - storedAttrs.padding, 1);
            } else if (isArray(storedAttrs.padding) && storedAttrs.padding.length === 2) {
              const arraySize = isArray(storedAttrs.size) ? storedAttrs.size : [storedAttrs.size, storedAttrs.size];

              graphicAttributes.size = [
                Math.max(arraySize[0] - storedAttrs.padding[0], 1),
                Math.max(arraySize[1] - storedAttrs.padding[1], 1)
              ];
            } else {
              graphicAttributes.size = storedAttrs.size;
            }
          },
          storedAttrs: 'paddingAttrs'
        }
      ] as AttributeTransform[]
    ).concat(transformsByType.symbol);
  }

  release(): void {
    super.release();
    this._encoders = null;
  }
}
