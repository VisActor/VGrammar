import type { IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { array, has, isBoolean, isNil, isFunction, isString, isArray, get } from '@visactor/vutils';
import { isEqual } from '@visactor/vgrammar-util';
import type { IBaseCoordinate } from '@visactor/vgrammar-coordinate';
import { BridgeElementKey } from './constants';
import { DiffState, HOOK_EVENT, GrammarMarkType } from './enums';
import { invokeEncoderToItems } from './mark/encode';
import { removeGraphicItem } from './util/graphic';
import { transformAttributes, getLineSegmentConfigs, isPointsMarkType, getLinePointsFromSegments } from './attributes';
import { getLargeRectsPoints, getLargeSymbolsPoints, getLinePoints } from './attributes/helpers';
import type {
  BaseEncodeSpec,
  IElement,
  IMark,
  IMarkConfig,
  MarkElementItem,
  MarkFunctionType,
  MarkKeySpec,
  MarkSpec,
  MarkType,
  StateEncodeSpec,
  StateProxyEncodeSpec
} from '../types';
import type { IGraphic, ILine, IGraphicAttribute } from '@visactor/vrender';
// eslint-disable-next-line no-duplicate-imports
import { CustomPath2D } from '@visactor/vrender';
import { invokeFunctionType, parseField } from '../parse/util';
import { transformColor } from './attributes/common';

export class Element implements IElement {
  mark: IMark;

  key: string;
  groupKey?: string;
  data: any[] = null;

  states: string[] = [];

  diffState: DiffState = DiffState.enter;
  // Element should be reserved as long as it need to animate
  isReserved: boolean = false;

  runtimeStatesEncoder: StateEncodeSpec = null;

  protected graphicItem: IGraphic;

  // hack before vRender refactoring
  items: MarkElementItem[] = [];

  constructor(mark: IMark) {
    this.mark = mark;
  }

  initGraphicItem(attributes: any = {}) {
    if (this.graphicItem) {
      return;
    }
    // 统一读取mark中是否可交互的配置
    const attrs = Object.assign({}, attributes);
    this.graphicItem = this.mark.addGraphicItem(attrs, this.groupKey);
    // 统一读取mark中是否可交互的配置
    this.graphicItem[BridgeElementKey] = this;

    this.graphicItem.onBeforeAttributeUpdate = (attributes: any) => {
      const graphicAttributes = transformAttributes(this.mark.getAttributeTransforms(), attributes, this);
      return graphicAttributes;
    };

    // transform initial attributes
    this.graphicItem.setAttributes(this.graphicItem.attribute);

    this.clearGraphicAttributes();
    if (this.mark.needAnimate()) {
      this.setPrevGraphicAttributes({});
      this.setNextGraphicAttributes(attributes);
      this.setFinalGraphicAttributes(attributes);
    }
  }

  updateGraphicItem(config: IMarkConfig) {
    if (!this.graphicItem) {
      return;
    }

    if (!isNil(config.clip)) {
      this.graphicItem.setAttribute('clip', config.clip);
    }
    if (!isNil(config.interactive)) {
      this.graphicItem.setAttribute('pickable', config.interactive);
    }
    if (!isNil(config.zIndex)) {
      this.graphicItem.setAttribute('zIndex', config.zIndex);
    }
    if (this.diffState === DiffState.exit) {
      (this.graphicItem as any).releaseStatus = 'willRelease';
    } else {
      (this.graphicItem as any).releaseStatus = undefined;
    }
    const markSpec = this.mark.getSpec() as MarkSpec;
    if (markSpec.animation?.state) {
      (this.graphicItem as any).stateAnimateConfig = markSpec.animation.state;
    }
  }

  getGraphicItem() {
    return this.graphicItem;
  }

  getBounds() {
    // FIXME: 没有更新 bounds 时拿到的 bound 可能为 null
    return this.graphicItem?.AABBBounds;
  }

  getStates() {
    return this.states.slice();
  }

  updateData(groupKey: string | null, data: any[], key: MarkKeySpec, view: any) {
    this.mark.emit(HOOK_EVENT.BEFORE_ELEMENT_UPDATE_DATA, { groupKey, data, key }, this);
    this.data = data;
    const keyGetter = parseField(key);
    this.items = data.map(datum => {
      const key = keyGetter(datum);
      const item = {
        datum,
        key,
        view,
        nextAttrs: {}
      };

      return item;
    });

    this.groupKey = groupKey;
    this.key = this.mark.isCollectionMark() ? groupKey : this.items?.[0].key;

    this.mark.emit(HOOK_EVENT.AFTER_ELEMENT_UPDATE_DATA, { groupKey, data, key }, this);
    return this.items;
  }

  state(markState: MarkFunctionType<string | string[]>, view: any, parameters: any) {
    const isCollectionMark = this.mark.isCollectionMark();

    const prevStateValues = this.states;
    const newStateValues = array(invokeFunctionType(markState, parameters, this.getDatum(), this));
    const stateSort = this.mark.getSpec()?.stateSort;

    if (stateSort) {
      stateSort.sort(stateSort);
    }

    const isStateChanged =
      newStateValues.length !== prevStateValues.length ||
      newStateValues.some((newState: string, index: number) => newState !== prevStateValues[index]);
    this.states = newStateValues;

    // early logic didn't handle collection mark, only update signal mark state for now
    if (!isCollectionMark && isStateChanged && this.diffState === DiffState.unChange) {
      this.diffState = DiffState.update;
    }
  }

  encodeGraphic() {
    this.coordinateTransformEncode(this.items);
    const graphicAttributes = this.transformElementItems(this.items, this.mark.markType);

    if (!this.graphicItem) {
      this.initGraphicItem(graphicAttributes);
    } else {
      this.applyGraphicAttributes(graphicAttributes);
    }

    if ((this.diffState === DiffState.enter || this.diffState === DiffState.update) && this.states.length) {
      this.graphicItem.clearStates();
      // 更新数据流后，states计算不缓存
      this.graphicItem.states = {};
      this.useStates(this.states);
    }

    if (this.mark.markType === GrammarMarkType.shape) {
      // FIXME: shape需要拿到原始数据进行编码，暂时把数据绑定到graphicItem上，看后续graphicItem是否需要支持数据绑定
      (this.graphicItem as any).datum = this.items[0].datum;
    }

    // clear item attributes
    this.items.forEach(item => {
      item.nextAttrs = {};
    });
    this._setCutomizedShape();
  }

  private _setCutomizedShape() {
    if (!this.graphicItem) {
      return;
    }
    const setCustomizedShape = this.mark.getSpec()?.setCustomizedShape;

    if (!setCustomizedShape) {
      return;
    }

    this.graphicItem.pathProxy = (attrs: Partial<IGraphicAttribute>) => {
      return setCustomizedShape(this.data, attrs, new CustomPath2D());
    };
  }

  encodeItems(items: MarkElementItem[], encoders: StateEncodeSpec, parameters: any) {
    const isCollectionMark = this.mark.isCollectionMark();
    // marshall encoder functions
    const updateEncoder = encoders.update;
    const enterEncoder = encoders.enter;
    const exitEncoder = encoders.exit;
    const onlyFullEncodeFirst = this.mark.isLargeMode();

    if (this.diffState === DiffState.enter) {
      if (enterEncoder) {
        invokeEncoderToItems(this, items, enterEncoder, parameters, onlyFullEncodeFirst);
      }
      if (updateEncoder) {
        invokeEncoderToItems(this, items, updateEncoder, parameters, onlyFullEncodeFirst);
      }
    } else if (this.diffState === DiffState.update) {
      if (isCollectionMark && enterEncoder) {
        invokeEncoderToItems(this, items, enterEncoder, parameters, onlyFullEncodeFirst);
      }
      if (updateEncoder) {
        invokeEncoderToItems(this, items, updateEncoder, parameters, onlyFullEncodeFirst);
      }
    } else if (this.diffState === DiffState.exit && exitEncoder) {
      // 移除的 item 不再包含状态
      invokeEncoderToItems(this, items, exitEncoder, parameters, onlyFullEncodeFirst);
    }
  }

  protected coordinateTransformEncode(items: MarkElementItem[]) {
    if (!this.mark.coord || this.mark.disableCoordinateTransform === true) {
      return;
    }
    const coord = this.mark.coord.output() as IBaseCoordinate;

    items.forEach(item => {
      const nextAttrs = item.nextAttrs;
      const convertedPoint: IPointLike = coord.convert(nextAttrs);
      Object.assign(nextAttrs, convertedPoint);
    });
  }

  clearStates(hasAnimation?: boolean) {
    const stateAnimation = isBoolean(hasAnimation)
      ? hasAnimation
      : !!(this.mark.getSpec() as MarkSpec).animation?.state;

    this.states = [];

    if (this.graphicItem) {
      this.graphicItem.clearStates(stateAnimation);
    }
  }

  private _updateRuntimeStates(state: string, attrs: any) {
    if (!this.runtimeStatesEncoder) {
      this.runtimeStatesEncoder = {};
    }

    this.runtimeStatesEncoder[state] = attrs;
  }

  hasState(state: string) {
    return this.states && this.states.includes(state);
  }

  addState(state: string | string[], attrs?: BaseEncodeSpec | StateProxyEncodeSpec) {
    const states = array(state);
    const nextStates = states.reduce((nextStates: string[], state: string) => {
      if (!nextStates.includes(state)) {
        nextStates.push(state);
      }
      return nextStates;
    }, this.states.slice());
    if (nextStates.length === this.states.length) {
      return;
    }

    if (attrs && isString(state)) {
      this._updateRuntimeStates(state, attrs);
    }
    this.useStates(nextStates);
  }

  removeState(state: string | string[]) {
    const states = array(state);
    const nextStates = this.states.filter(state => !states.includes(state));
    if (nextStates.length === this.states.length) {
      return;
    }
    this.useStates(nextStates);
  }

  protected getStateAttrs = (stateName: string, nextStates: string[]) => {
    const encoder = this.runtimeStatesEncoder?.[stateName] ?? (this.mark.getSpec() as MarkSpec).encode?.[stateName];

    if (!encoder) {
      return {};
    }

    if (isFunction(encoder)) {
      return (encoder as StateProxyEncodeSpec)(this.getDatum(), this, stateName, nextStates);
    }

    if (this.graphicItem.states?.[stateName]) {
      return this.graphicItem.states[stateName];
    }

    const stateItems = this.items.map(item => Object.assign({}, item, { nextAttrs: {} }));
    // collection图元，暂时不支持在state更新中，支持更新points更新
    invokeEncoderToItems(this, stateItems, encoder, (this.mark as any).parameters());

    const graphicAttributes = this.transformElementItems(stateItems, this.mark.markType);

    if (!this.graphicItem.states) {
      this.graphicItem.states = { [stateName]: graphicAttributes };
    } else if (!this.graphicItem.states[stateName]) {
      this.graphicItem.states[stateName] = graphicAttributes;
    }

    // FIXME: remove this logic after vRender deprecates fillColor&strokeColor channel
    transformColor(graphicAttributes);
    return graphicAttributes;
  };

  useStates(states: string[], hasAnimation?: boolean) {
    if (!this.graphicItem) {
      return;
    }
    this.mark.emit(HOOK_EVENT.BEFORE_ELEMENT_STATE, { states }, this);

    this.states = states.slice();
    const stateSort = this.mark.getSpec()?.stateSort;

    if (stateSort) {
      this.states.sort(stateSort);
    }

    const stateAnimation = isBoolean(hasAnimation)
      ? hasAnimation
      : !!(this.mark.getSpec() as MarkSpec).animation?.state;
    this.graphicItem.stateProxy = this.getStateAttrs;
    this.graphicItem.useStates(this.states, stateAnimation);

    this.mark.emit(HOOK_EVENT.AFTER_ELEMENT_STATE, { states }, this);
  }

  protected diffAttributes(graphicAttributes: { [channel: string]: any }) {
    const diffResult = {};
    const finalGraphicAttributes = this.getFinalGraphicAttributes();
    for (const key in graphicAttributes) {
      if (!isEqual(key, finalGraphicAttributes, graphicAttributes) || !has(finalGraphicAttributes, key)) {
        diffResult[key] = graphicAttributes[key];
      }
    }
    return diffResult;
  }

  /**
   * tranform the attribute to graphic attribute
   * @param items
   * @param markType   In ordinary, markType is equal to mark.markType, but in glyph, markType is different from mark.markType
   * @param markName
   * @param computePoints
   * @returns
   */
  transformElementItems(items: MarkElementItem[], markType: MarkType, computePoints?: boolean): Record<string, any> {
    const item = items[0];

    if (!item.nextAttrs || Object.keys(item.nextAttrs).length === 0) {
      return {};
    }

    let nextAttrs = item?.nextAttrs;

    if (
      items &&
      items.length &&
      isNil(item.nextAttrs?.points) &&
      computePoints !== false &&
      isPointsMarkType(markType)
    ) {
      const lastPoints = this.getGraphicAttribute('points', false);
      const lastSegments = this.getGraphicAttribute('segments', false);
      const enableSegments = item.nextAttrs.enableSegments ?? this.getGraphicAttribute('enableSegments', false);
      const itemNextAttrs = items.map(item => item.nextAttrs);
      const isProgressive = this.mark.isProgressive();
      nextAttrs = Object.assign({}, nextAttrs);
      delete nextAttrs.x;
      delete nextAttrs.y;

      if (markType === GrammarMarkType.line || markType === GrammarMarkType.area) {
        const linePoints = getLinePoints(items, true, lastPoints, markType === GrammarMarkType.area);

        // chartspace新增了配置，用于开启线段解析；渐进渲染状态不支持线段样式
        if (enableSegments && !isProgressive) {
          const points = !linePoints || linePoints.length === 0 ? getLinePointsFromSegments(lastSegments) : linePoints;
          const segments = getLineSegmentConfigs(itemNextAttrs, points, this);

          if (segments) {
            Object.assign(nextAttrs, {
              segments: segments,
              points: null
            });
          } else {
            Object.assign(nextAttrs, {
              points: points,
              segments: null
            });
          }
        } else if (isProgressive) {
          Object.assign(nextAttrs, {
            segments: ((this.graphicItem as ILine)?.attribute?.segments ?? []).concat([{ points: linePoints }])
          });
        } else {
          Object.assign(nextAttrs, {
            points: linePoints,
            segments: null
          });
        }
      } else if (markType === GrammarMarkType.largeRects) {
        nextAttrs.points = getLargeRectsPoints(items, true, lastPoints);
      } else if (markType === GrammarMarkType.largeSymbols) {
        nextAttrs.points = getLargeSymbolsPoints(items, true, lastPoints);
      }
    }

    return nextAttrs;
  }

  protected applyGraphicAttributes(graphicAttributes: any) {
    if (this.mark.needAnimate()) {
      // If mark need animate, diff attributes.
      const nextGraphicAttributes = this.diffAttributes(graphicAttributes);
      const prevGraphicAttributes = this.getPrevGraphicAttributes();
      const finalGraphicAttributes = this.getFinalGraphicAttributes();
      Object.keys(nextGraphicAttributes).forEach(channel => {
        prevGraphicAttributes[channel] = this.getGraphicAttribute(channel);
        finalGraphicAttributes[channel] = nextGraphicAttributes[channel];
      });
      this.setNextGraphicAttributes(nextGraphicAttributes);
      this.setPrevGraphicAttributes(prevGraphicAttributes);
      this.setFinalGraphicAttributes(finalGraphicAttributes);

      // Apply next attributes to current graphic item immediately.
      // Scene graph tree should be handled like no animation exists in dataflow procedure.
      this.graphicItem.setAttributes(nextGraphicAttributes);
    } else {
      // Otherwise, directly apply all attributes.
      this.graphicItem.setAttributes(graphicAttributes);
    }
  }

  getGraphicAttribute(channel: string, prev: boolean = false) {
    if (!this.graphicItem) {
      return undefined;
    }

    if (prev) {
      let value: any;
      const prevGraphicAttributes = this.getPrevGraphicAttributes();
      if (!isNil((value = get(prevGraphicAttributes, channel)))) {
        return value;
      }
    }

    // get attribute before transformed
    const trans = this.mark.getAttributeTransforms();
    let getKey: string[] = [channel];
    if (trans && trans.length) {
      const channelTransform = trans.find(entry => {
        return entry.storedAttrs && entry.channels.includes(channel);
      });

      if (channelTransform) {
        getKey = [channelTransform.storedAttrs, channel];
      }
    }
    return get(this.graphicItem?.attribute, getKey);
  }

  setGraphicAttribute(channel: string, value: any, final: boolean = true) {
    if (!this.graphicItem) {
      return;
    }
    const finalGraphicAttributes = this.getFinalGraphicAttributes();
    const prevGraphicAttributes = this.getPrevGraphicAttributes();

    if (final && finalGraphicAttributes) {
      finalGraphicAttributes[channel] = value;
    }
    if (prevGraphicAttributes && !has(prevGraphicAttributes, channel)) {
      prevGraphicAttributes[channel] = this.graphicItem.attribute[channel];
    }

    this.graphicItem.setAttribute(channel, value);
  }

  setGraphicAttributes(attributes: { [channel: string]: any }, final: boolean = true) {
    if (!this.graphicItem) {
      return;
    }
    const finalGraphicAttributes = this.getFinalGraphicAttributes();
    const prevGraphicAttributes = this.getPrevGraphicAttributes();

    Object.keys(attributes).forEach(key => {
      if (finalGraphicAttributes && final) {
        finalGraphicAttributes[key] = attributes[key];
      }
      if (prevGraphicAttributes && !has(prevGraphicAttributes, key)) {
        prevGraphicAttributes[key] = this.graphicItem.attribute[key];
      }
    });

    this.graphicItem.setAttributes(attributes);
  }

  /**
   * 获取 vRender 已变更的视觉通道属性，只应当由 VGrammar 中 调用
   * @returns 视觉通道键值对
   */
  getFinalGraphicAttributes() {
    return (this.graphicItem as any).finalAttrs;
  }

  protected setFinalGraphicAttributes(attributes: { [channel: string]: any }) {
    (this.graphicItem as any).finalAttrs = attributes;
  }

  /**
   * 获取 vRender 变更前的视觉通道属性，只应当由 VGrammar 调用
   * @returns 视觉通道键值对
   */
  getPrevGraphicAttributes() {
    return (this.graphicItem as any).prevAttrs;
  }

  protected setPrevGraphicAttributes(attributes: { [channel: string]: any }) {
    (this.graphicItem as any).prevAttrs = attributes;
  }

  /**
   * 获取 vRender 在单次 dataflow 中变更的视觉通道属性，只应当由 VGrammar 调用
   * @returns 视觉通道键值对
   */
  getNextGraphicAttributes() {
    return (this.graphicItem as any).nextAttrs;
  }

  protected setNextGraphicAttributes(attributes: { [channel: string]: any }) {
    (this.graphicItem as any).nextAttrs = attributes;
  }

  clearChangedGraphicAttributes() {
    if (this.graphicItem) {
      this.setPrevGraphicAttributes({});
      this.setNextGraphicAttributes({});
    }
  }

  clearGraphicAttributes() {
    if (this.graphicItem) {
      this.setPrevGraphicAttributes({});
      this.setNextGraphicAttributes({});
      this.setFinalGraphicAttributes({});
    }
  }

  remove() {
    if (this.graphicItem) {
      removeGraphicItem(this.graphicItem);
      this.graphicItem = null;
    }
  }

  release() {
    this.mark = null;
    this.data = null;
    // FIXME: removeGraphicItem 有性能问题，暂时不调用
    if (this.graphicItem) {
      removeGraphicItem(this.graphicItem);
      this.graphicItem[BridgeElementKey] = null;
      this.graphicItem = null;
    }
    this.items = null;
  }
  /**
   * hack support for transform & encode logic. DO NOT USE.
   */
  getItemAttribute(channel?: string) {
    if (!this.items?.length) {
      return;
    }

    if (this.mark.isCollectionMark()) {
      return isNil(channel)
        ? this.items.map(item => item.nextAttrs)
        : this.items.map(item => item.nextAttrs?.[channel]);
    }

    return isNil(channel) ? this.items[0].nextAttrs : this.items[0].nextAttrs?.[channel];
  }
  setItemAttributes(attributes: { [channel: string]: any } | any[]) {
    if (!this.items?.length) {
      return;
    }

    if (this.mark.isCollectionMark()) {
      if (isArray(attributes)) {
        this.items.forEach((item, index) => {
          Object.assign(item.nextAttrs, attributes[index]);
        });
      }
    } else {
      Object.assign(this.items[0].nextAttrs, attributes);
    }
  }
  /**
   * hack support for transform & encode logic. DO NOT USE.
   */
  getItem() {
    return this.mark.isCollectionMark() ? this.items ?? [] : this.items?.[0];
  }
  getDatum() {
    return this.mark.isCollectionMark() ? this.data ?? [] : this.data?.[0];
  }
}
