import { has, isNil, isBoolean, isFunction, isEqual } from '@visactor/vutils';
import type {
  IGlyphElement,
  IGlyphMark,
  MarkElementItem,
  MarkSpec,
  IGlyphMeta,
  MarkType,
  StateProxyEncodeSpec
} from '../types';
import { cloneTransformAttributes, transformAttributes } from './attributes/transform';
import { BridgeElementKey, CollectionMarkType } from './constants';
import { DiffState, HOOK_EVENT, GrammarMarkType } from './enums';
import { Element } from './element';
import { invokeEncoderToItems } from './mark/encode';
import type { IGraphicAttribute, IGlyph } from '@visactor/vrender-core';

export class GlyphElement extends Element implements IGlyphElement {
  declare graphicItem: IGlyph;

  declare mark: IGlyphMark;
  protected glyphGraphicItems: { [markName: string]: any };

  private glyphMeta: IGlyphMeta;

  constructor(mark: IGlyphMark) {
    super(mark);
    this.glyphMeta = this.mark.getGlyphMeta();
  }

  getGlyphGraphicItems() {
    return this.glyphGraphicItems;
  }

  initGraphicItem(attributes: any = {}) {
    if (this.graphicItem) {
      return;
    }

    this.graphicItem = this.mark.addGraphicItem(attributes, this.groupKey) as IGlyph;
    this.graphicItem[BridgeElementKey] = this;
    this.graphicItem.onBeforeAttributeUpdate = this._onGlyphAttributeUpdate(false);

    const glyphMarks = this.glyphMeta.getMarks();
    this.glyphGraphicItems = {};
    this.graphicItem.getSubGraphic().forEach((graphic: any) => {
      const markType = glyphMarks[graphic.name];
      this.glyphGraphicItems[graphic.name] = graphic;
      graphic.onBeforeAttributeUpdate = (attributes: any) => {
        // mark might be released
        if (!this.mark) {
          return attributes;
        }
        const graphicAttributes = transformAttributes(markType, attributes, this, graphic.name);
        return graphicAttributes;
      };
    });

    this.clearGraphicAttributes();
  }

  useStates(states: string[], hasAnimation?: boolean) {
    if (!this.graphicItem) {
      return false;
    }
    this.mark.emit(HOOK_EVENT.BEFORE_ELEMENT_STATE, { states }, this);

    this.states = states.slice();

    const stateAnimationEnable = isBoolean(hasAnimation) ? hasAnimation : this.hasStateAnimation();

    this.graphicItem.glyphStateProxy = this.getStateAttrs;
    this.graphicItem.useStates(this.states, stateAnimationEnable);

    this.mark.emit(HOOK_EVENT.AFTER_ELEMENT_STATE, { states }, this);

    return true;
  }

  protected getStateAttrs = (stateName: string, nextStates: string[]) => {
    const isRuntimeState = !isNil(this.runtimeStatesEncoder?.[stateName]);
    const encoder = isRuntimeState
      ? {
          ...(this.mark.getSpec() as MarkSpec).encode?.[stateName],
          ...this.runtimeStatesEncoder[stateName]
        }
      : (this.mark.getSpec() as MarkSpec).encode?.[stateName];

    const glyphStateAttributes = {} as {
      attributes: Partial<IGraphicAttribute>;
      subAttributes: Partial<IGraphicAttribute>[];
    };

    if (!encoder) {
      return glyphStateAttributes;
    }

    if (isFunction(encoder)) {
      glyphStateAttributes.attributes = (encoder as StateProxyEncodeSpec)(this.getDatum(), this, stateName, nextStates);
      return glyphStateAttributes;
    }

    if (!isRuntimeState && this.graphicItem.glyphStates?.[stateName]) {
      return this.graphicItem.glyphStates[stateName];
    }

    if (encoder) {
      const item = this.items[0];
      const targetItems = [Object.assign({}, item, { nextAttrs: {} })];

      invokeEncoderToItems(this, targetItems, encoder, (this.mark as any).parameters());
      this.coordinateTransformEncode(targetItems);

      glyphStateAttributes.attributes = targetItems[0].nextAttrs;

      if (!this.graphicItem.glyphStates) {
        this.graphicItem.glyphStates = { [stateName]: glyphStateAttributes };
      } else if (!this.graphicItem.glyphStates[stateName]) {
        this.graphicItem.glyphStates[stateName] = glyphStateAttributes;
      }

      return glyphStateAttributes;
    }

    return glyphStateAttributes;
  };

  encodeGraphic() {
    this.coordinateTransformEncode(this.items);
    const graphicAttributes = this.transformElementItems(this.items, this.mark.markType);

    if (!this.graphicItem) {
      this.initGraphicItem();
    }

    if (this.diffState === DiffState.enter) {
      // apply default encoder when enter
      this.graphicItem.onBeforeAttributeUpdate = this._onGlyphAttributeUpdate(true);
      this.applyGraphicAttributes(graphicAttributes);
      this.graphicItem.onBeforeAttributeUpdate = this._onGlyphAttributeUpdate(false);
    } else {
      this.applyGraphicAttributes(graphicAttributes);
    }

    if ((this.diffState === DiffState.enter || this.diffState === DiffState.update) && this.states.length) {
      Object.values(this.glyphGraphicItems).forEach(graphicItem => {
        // 更新数据流后，states计算不缓存
        graphicItem.states = {};
      });
      this.useStates(this.states);
    }

    // clear item attributes
    this.items.map(item => {
      item.nextAttrs = {};
    });
  }

  encodeCustom(nextAttrs?: any): { [markName: string]: any } {
    let customEncodeValues: { [markName: string]: any } = {};
    const channelEncoder = this.glyphMeta.getChannelEncoder();
    const functionEncoder = this.glyphMeta.getFunctionEncoder();

    if (functionEncoder) {
      customEncodeValues = functionEncoder.call(
        null,
        Object.assign({}, this.graphicItem?.attribute, nextAttrs),
        this.getDatum(),
        this,
        this.mark.getGlyphConfig()
      );
    }
    if (channelEncoder) {
      // TODO: maybe delete origin encode value?
      let allAttrs: any;
      Object.keys(channelEncoder).forEach(channel => {
        if (!isNil(nextAttrs[channel])) {
          if (!allAttrs) {
            allAttrs = Object.assign({}, this.graphicItem?.attribute, nextAttrs);
          }
          const encodeResult = channelEncoder[channel].call(
            null,
            channel,
            nextAttrs[channel],
            allAttrs,
            this.getDatum(),
            this,
            this.mark.getGlyphConfig()
          );
          Object.keys(encodeResult ?? {}).forEach(markName => {
            customEncodeValues[markName] = Object.assign(customEncodeValues[markName] ?? {}, encodeResult[markName]);
          });
        }
      });
    }
    return customEncodeValues;
  }

  private encodeDefault() {
    const defaultEncodeValues: { [markName: string]: any } = {};
    // apply default encode
    if (this.diffState === DiffState.enter && this.glyphMeta.getDefaultEncoder()) {
      const defaultEncodeResult = this.glyphMeta
        .getDefaultEncoder()
        .call(null, this.getDatum(), this, this.mark.getGlyphConfig());
      Object.assign(defaultEncodeValues, defaultEncodeResult);
    }
    return defaultEncodeValues;
  }

  private _onGlyphAttributeUpdate(first: boolean = false) {
    return (attributes: any) => {
      // mark might be released
      if (!this.mark) {
        return attributes;
      }
      const glyphMarks = this.glyphMeta.getMarks();

      const graphicAttributes = transformAttributes(this.mark.getAttributeTransforms(), attributes, this);

      // apply default encode
      const defaultEncodeValues = first ? this.encodeDefault() : null;
      // apply custom encode
      const customEncodeValues = this.encodeCustom(attributes);

      Object.keys(glyphMarks).forEach(markName => {
        const markType = glyphMarks[markName];
        const graphicItem = this.glyphGraphicItems[markName];
        const customAttributes = customEncodeValues?.[markName];
        const additionalAttributes = Object.assign({}, customAttributes);
        if (first) {
          // apply default attributes when visual channel is not set
          const defaultAttributes = defaultEncodeValues?.[markName];
          Object.keys(defaultAttributes ?? {}).forEach(key => {
            if (!has(this.items[0].nextAttrs, key) && !has(additionalAttributes, key)) {
              additionalAttributes[key] = defaultAttributes[key];
            }
          });
        }
        const glyphAttributes = Object.assign({}, cloneTransformAttributes(markType, attributes), additionalAttributes);
        const glyphItems = this._generateGlyphItems(markType, this.items, glyphAttributes);
        this.coordinateTransformEncode(glyphItems);
        const graphicAttributes = this.transformElementItems(glyphItems, markType);

        this.applyGlyphGraphicAttributes(graphicAttributes, markName, graphicItem);

        if (markType === GrammarMarkType.shape) {
          // FIXME: shape需要拿到原始数据进行编码，暂时把数据绑定到graphicItem上，看后续graphicItem是否需要支持数据绑定
          graphicItem.datum = glyphItems[0].datum;
        }
      });

      return graphicAttributes;
    };
  }

  private _generateGlyphItems(markType: MarkType, items: MarkElementItem[], additionalAttributes: any) {
    const glyphItems = items.map(item => Object.assign({}, item, { nextAttrs: additionalAttributes }));

    if ((CollectionMarkType as string[]).includes(markType) && this.mark.getSpec().enableSegments) {
      // segment mark require all items to apply additional attributes
      glyphItems.forEach((glyphItem, index) => {
        glyphItem.nextAttrs = Object.assign({}, items[index].nextAttrs, additionalAttributes);
      });
    }

    return glyphItems;
  }

  getGraphicAttribute(channel: string, prev: boolean = false, markName?: any) {
    if (!this.graphicItem) {
      return undefined;
    }
    const prevGraphicAttributes = this.getPrevGraphicAttributes(markName);
    if (prev && has(prevGraphicAttributes, channel)) {
      return prevGraphicAttributes[channel];
    }

    const graphicItem = markName ? this.glyphGraphicItems[markName] : this.graphicItem;
    return graphicItem.attribute[channel];
  }

  setGraphicAttribute(channel: string, value: any, final: boolean = true, markName?: any) {
    if (!this.graphicItem) {
      return;
    }
    const graphicItem = markName ? this.glyphGraphicItems[markName] : this.graphicItem;
    const finalGraphicAttributes = this.getFinalGraphicAttributes(markName);
    const prevGraphicAttributes = this.getPrevGraphicAttributes(markName);

    if (final) {
      finalGraphicAttributes[channel] = value;
    }
    if (!has(prevGraphicAttributes, channel)) {
      prevGraphicAttributes[channel] = graphicItem.attribute[channel];
    }

    graphicItem.setAttribute(channel, value);
  }

  setGraphicAttributes(attributes: { [channel: string]: any }, final: boolean = true, markName?: any) {
    if (!this.graphicItem) {
      return;
    }
    const graphicItem = markName ? this.glyphGraphicItems[markName] : this.graphicItem;
    const finalGraphicAttributes = this.getFinalGraphicAttributes(markName);
    const prevGraphicAttributes = this.getPrevGraphicAttributes(markName);

    Object.keys(attributes).forEach(key => {
      if (final) {
        finalGraphicAttributes[key] = attributes[key];
      }
      if (!has(prevGraphicAttributes, key)) {
        prevGraphicAttributes[key] = graphicItem.attribute[key];
      }
    });

    graphicItem.setAttributes(attributes);
  }

  protected diffAttributes(graphicAttributes: { [channel: string]: any }, markName?: string) {
    const diffResult = {};
    const finalGraphicAttributes = this.getFinalGraphicAttributes(markName);
    for (const key in graphicAttributes) {
      if (!has(finalGraphicAttributes, key) || !isEqual(finalGraphicAttributes[key], graphicAttributes[key])) {
        diffResult[key] = graphicAttributes[key];
      }
    }
    return diffResult;
  }

  protected applyGlyphGraphicAttributes(graphicAttributes: any, markName: string, graphicItem: any): void {
    if (this.mark.needAnimate()) {
      // If mark need animate, diff attributes.
      const nextGraphicAttributes = this.diffAttributes(graphicAttributes, markName);
      const prevGraphicAttributes = this.getPrevGraphicAttributes(markName) ?? {};
      const finalGraphicAttributes = this.getFinalGraphicAttributes(markName) ?? {};
      Object.keys(nextGraphicAttributes).forEach(channel => {
        prevGraphicAttributes[channel] = graphicItem.attribute[channel];
        finalGraphicAttributes[channel] = nextGraphicAttributes[channel];
      });
      this.setNextGraphicAttributes(nextGraphicAttributes, markName);
      this.setPrevGraphicAttributes(prevGraphicAttributes, markName);
      this.setFinalGraphicAttributes(finalGraphicAttributes, markName);

      // Apply next attributes to current graphic item immediately.
      // Scene graph tree should be handled like no animation exists in dataflow procedure.
      graphicItem.setAttributes(nextGraphicAttributes);
    } else {
      graphicItem.setAttributes(graphicAttributes);
    }
  }

  getFinalGraphicAttributes(markName?: string) {
    const graphicItem = markName ? this.glyphGraphicItems[markName] : this.graphicItem;
    return graphicItem.finalAttrs;
  }

  protected setFinalGraphicAttributes(attributes: { [channel: string]: any }, markName?: string) {
    const graphicItem = markName ? this.glyphGraphicItems[markName] : this.graphicItem;
    graphicItem.finalAttrs = attributes;
  }

  getPrevGraphicAttributes(markName?: string) {
    const graphicItem = markName ? this.glyphGraphicItems[markName] : this.graphicItem;
    return graphicItem.prevAttrs;
  }

  protected setPrevGraphicAttributes(attributes: { [channel: string]: any }, markName?: string) {
    const graphicItem = markName ? this.glyphGraphicItems[markName] : this.graphicItem;
    graphicItem.prevAttrs = attributes;
  }

  getNextGraphicAttributes(markName?: string) {
    const graphicItem = markName ? this.glyphGraphicItems[markName] : this.graphicItem;
    return graphicItem.nextAttrs;
  }

  protected setNextGraphicAttributes(attributes: { [channel: string]: any }, markName?: string) {
    const graphicItem = markName ? this.glyphGraphicItems[markName] : this.graphicItem;
    graphicItem.nextAttrs = attributes;
  }

  clearChangedGraphicAttributes() {
    this.setPrevGraphicAttributes(null);
    this.setNextGraphicAttributes(null);
    Object.keys(this.glyphGraphicItems).forEach(markName => {
      this.setPrevGraphicAttributes(null, markName);
      this.setNextGraphicAttributes(null, markName);
    });
  }

  clearGraphicAttributes() {
    this.setPrevGraphicAttributes(null);
    this.setNextGraphicAttributes(null);
    this.setFinalGraphicAttributes(null);
    Object.keys(this.glyphGraphicItems).forEach(markName => {
      this.setPrevGraphicAttributes(null, markName);
      this.setNextGraphicAttributes(null, markName);
      this.setFinalGraphicAttributes(null, markName);
    });
  }

  remove() {
    this.glyphGraphicItems = null;
    super.remove();
  }

  release() {
    if (this.glyphGraphicItems) {
      Object.values(this.glyphGraphicItems).forEach(graphicItem => {
        graphicItem[BridgeElementKey] = null;
      });
      this.glyphGraphicItems = null;
    }
    super.release();
  }
}
