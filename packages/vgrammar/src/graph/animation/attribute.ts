import type { EasingType, IGraphic } from '@visactor/vrender';
// eslint-disable-next-line no-duplicate-imports
import { ACustomAnimate, AttributeUpdateType } from '@visactor/vrender';
import { has, isArray, isFunction, isNil, isObject } from '@visactor/vutils';
import type {
  IAnimationChannelInterpolator,
  IAnimationEffect,
  IAnimationParameters,
  IElement,
  IGlyphElement,
  IParsedAnimationAttrs
} from '../../types';
import { getAnimationType } from '../../view/register-animation';
import { isValidPointsChannel } from '../attributes/helpers';
import { transformColor } from '../attributes/common';

const transformAnimationAttributes = (attributes: IParsedAnimationAttrs, element: IElement): IParsedAnimationAttrs => {
  if (!attributes) {
    return null;
  }

  if (attributes?.from) {
    const from = attributes.from;
    Object.keys(from).forEach(channel => {
      if (isNil(from[channel])) {
        delete from[channel];
      }
    });
    const computePoints = isValidPointsChannel(Object.keys(from), element.mark.markType);
    if (computePoints) {
      const items = element.items.map(item => Object.assign({}, item, { nextAttrs: from }));
      attributes.from = element.transformElementItems(items, element.mark.markType, computePoints);
    }
  }
  if (attributes?.to) {
    const to = attributes.to;
    Object.keys(to).forEach(channel => {
      if (isNil(to[channel])) {
        delete to[channel];
      }
    });
    const computePoints = isValidPointsChannel(Object.keys(to), element.mark.markType);
    if (computePoints) {
      const items = element.items.map(item => Object.assign({}, item, { nextAttrs: to }));
      attributes.to = element.transformElementItems(items, element.mark.markType, computePoints);
    }
  }

  return attributes;
};

export function typeAnimationAttributes(
  element: IElement,
  effect: IAnimationEffect,
  animationParameters: IAnimationParameters
): IParsedAnimationAttrs {
  const options = isFunction(effect.options)
    ? effect.options.call(null, element.getDatum(), element, element.mark.parameters())
    : effect.options;
  if (!effect.type || !getAnimationType(effect.type)) {
    return null;
  }
  const attributes = getAnimationType(effect.type)(element as IGlyphElement, options, animationParameters);
  return transformAnimationAttributes(attributes, element);
}

const parseChannelValue = (
  element: IElement,
  channel: string,
  channelValue: any,
  animationParameters: IAnimationParameters
) => {
  return isFunction(channelValue) ? channelValue(element.getDatum(), element, animationParameters) : channelValue;
};

export function channelAnimationAttributes(
  element: IElement,
  effect: IAnimationEffect,
  animationParameters: IAnimationParameters
): IParsedAnimationAttrs {
  const channel = effect.channel;
  let attributes: IParsedAnimationAttrs = null;

  if (isArray(channel)) {
    attributes = channel.reduce(
      (res, key) => {
        res.from[key] = element.getGraphicAttribute(key, true);
        res.to[key] = element.getGraphicAttribute(key, false);
        return res;
      },
      { from: {}, to: {} }
    );
  } else if (isObject(channel)) {
    attributes = Object.keys(channel).reduce(
      (res, key) => {
        const hasFrom = !isNil(channel[key]?.from);
        const hasTo = !isNil(channel[key]?.to);

        if (hasFrom || hasTo) {
          res.from[key] = hasFrom ? parseChannelValue(element, key, channel[key].from, animationParameters) : undefined;
          res.to[key] = hasTo
            ? parseChannelValue(element, key, channel[key].to, animationParameters)
            : element.getGraphicAttribute(key, false);
        }

        return res;
      },
      { from: {}, to: {} }
    );
  }

  return transformAnimationAttributes(attributes, element);
}

export class CustomInterpolator extends ACustomAnimate<any> {
  private _element: IElement;
  private _interpolator?: IAnimationChannelInterpolator;

  constructor(
    from: any,
    to: any,
    duration: number,
    easing: EasingType,
    params: { interpolator: IAnimationChannelInterpolator; element: IElement; parameters?: any }
  ) {
    super(from, to, duration, easing, params);
    this._interpolator = params?.interpolator;
    this._element = params?.element;
  }

  onBind() {
    this.from = this.from ?? {};
    this.to = this.to ?? {};
  }

  getEndProps(): void | Record<string, any> {
    return this.to;
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    if (!this._interpolator || !this._element) {
      return;
    }
    this._interpolator.call(
      this,
      ratio,
      this.from,
      this.to,
      out,
      this._element.getDatum(),
      this._element,
      this.params.parameters
    );
  }
}

export class AttributeAnimate extends ACustomAnimate<any> {
  declare target: IGraphic;

  private _fromAttribute: any;
  private _toAttribute: any;

  getEndProps(): Record<string, any> {
    return this.to;
  }

  onBind() {
    this.from = this.from ?? {};
    this.to = this.to ?? {};
    // FIXME: remove this logic after vRender deprecates fillColor&strokeColor channel
    transformColor(this.from);
    transformColor(this.to);
  }

  onStart(): void {
    const from = Object.assign({}, this.from);
    const to = Object.assign({}, this.to);
    Object.keys(to).forEach(k => {
      if (isNil(from[k])) {
        from[k] = this.target.getComputedAttribute(k);
      }
      // if (this.to[k] === from[k]) {
      //   delete from[k];
      // }
    });
    this.target.setAttributes(from, false, {
      type: AttributeUpdateType.ANIMATE_UPDATE,
      animationState: { ratio: 0, end: false }
    });

    this._fromAttribute = from;
    this._toAttribute = to;
  }

  onEnd(): void {
    this.target.setAttributes(this._toAttribute, false, {
      type: AttributeUpdateType.ANIMATE_END
    });
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    this.target.stepInterpolate(
      this.subAnimate,
      this.subAnimate.animate,
      out,
      this.step,
      ratio,
      end,
      this._toAttribute,
      this._fromAttribute
    );
  }
}
