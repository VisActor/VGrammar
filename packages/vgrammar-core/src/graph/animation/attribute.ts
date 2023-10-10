import type { EasingType, IGraphic } from '@visactor/vrender-core';
// eslint-disable-next-line no-duplicate-imports
import { ACustomAnimate, AttributeUpdateType, NOWORK_ANIMATE_ATTR } from '@visactor/vrender-core';
import { isArray, isFunction, isNil, isObject, isValid } from '@visactor/vutils';
import type {
  IAnimationChannelInterpolator,
  IAnimationEffect,
  IAnimationParameters,
  IElement,
  IGlyphElement,
  IParsedAnimationAttrs
} from '../../types';
import { isValidPointsChannel } from '../attributes/helpers';
import { Factory } from '../../core/factory';

const transformAnimationAttributes = (attributes: IParsedAnimationAttrs, element: IElement): IParsedAnimationAttrs => {
  if (!attributes) {
    return null;
  }

  if (attributes?.from) {
    const from = attributes.from;
    const fromKeys = Object.keys(from);
    fromKeys.forEach(channel => {
      if (isNil(from[channel])) {
        delete from[channel];
      }
    });
    const computePoints = isValidPointsChannel(fromKeys, element.mark.markType) && !isValid(from.segments);
    if (computePoints) {
      const items = element.items.map(item => Object.assign({}, item, { nextAttrs: from }));
      attributes.from = element.transformElementItems(items, element.mark.markType, computePoints);
    }
  }
  if (attributes?.to) {
    const to = attributes.to;
    const toKeys = Object.keys(to);
    toKeys.forEach(channel => {
      if (isNil(to[channel])) {
        delete to[channel];
      }
    });
    const computePoints = isValidPointsChannel(toKeys, element.mark.markType) && !isValid(to.segments);
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
  animationParameters: IAnimationParameters,
  parameters: any
): IParsedAnimationAttrs {
  // const parameters =
  const options = isFunction(effect.options)
    ? effect.options.call(null, element.getDatum(), element, parameters)
    : effect.options;
  if (!effect.type || !Factory.getAnimationType(effect.type)) {
    return null;
  }
  const attributes = Factory.getAnimationType(effect.type)(element as IGlyphElement, options, animationParameters);
  return transformAnimationAttributes(attributes, element);
}

const parseChannelValue = (
  element: IElement,
  channel: string,
  channelValue: any,
  animationParameters: IAnimationParameters,
  parameters: any
) => {
  return isFunction(channelValue) ? channelValue(element.getDatum(), element, parameters) : channelValue;
};

export function channelAnimationAttributes(
  element: IElement,
  effect: IAnimationEffect,
  animationParameters: IAnimationParameters,
  parameters: any
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
          res.from[key] = hasFrom
            ? parseChannelValue(element, key, channel[key].from, animationParameters, parameters)
            : undefined;
          res.to[key] = hasTo
            ? parseChannelValue(element, key, channel[key].to, animationParameters, parameters)
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
  }

  onStart(): void {
    const excludedChannelMap = (this.target.constructor as any).NOWORK_ANIMATE_ATTR ?? NOWORK_ANIMATE_ATTR;
    const excludedChannels = Object.keys(excludedChannelMap).filter(channel => excludedChannelMap[channel] !== 0);
    this.subAnimate.animate.preventAttrs(excludedChannels);

    const from = Object.assign({}, this.from);
    const to = Object.assign({}, this.to);
    Object.keys(to).forEach(k => {
      if (excludedChannels.includes(k)) {
        from[k] = to[k];
        this.from[k] = to[k];
      } else if (isNil(from[k])) {
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

  update(end: boolean, ratio: number, out: Record<string, any>): void {
    if (this.updateCount === 0) {
      this.onFirstRun();
    }
    this.updateCount += 1;

    // Hack: waiting for canopus to remove invalid key when updating
    const lastProps = this.step.getLastProps();
    Object.keys(lastProps).forEach(key => {
      if (this.subAnimate.animate.validAttr(key)) {
        out[key] = lastProps[key];
      }
    });
    this.onUpdate(end, ratio, out);
    if (end) {
      this.onEnd();
    }
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
