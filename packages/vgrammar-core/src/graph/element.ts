import type { IBounds, IPointLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import {
  array,
  has,
  isBoolean,
  isNil,
  isFunction,
  isString,
  isArray,
  get,
  isEmpty,
  isEqual as isObjEqual,
  isObject
} from '@visactor/vutils';
import type { IBaseCoordinate } from '@visactor/vgrammar-coordinate';
import { BridgeElementKey, MARK_OVERLAP_HIDE_KEY } from './constants';
import { DiffState, HOOK_EVENT, GrammarMarkType, BuiltInEncodeNames } from './enums';
import { invokeEncoder, invokeEncoderToItems } from './mark/encode';
import { removeGraphicItem } from './util/graphic';
import { transformAttributes } from './attributes/transform';
import {
  getLargeRectsPoints,
  getLargeSymbolsPoints,
  getLinePoints,
  isValidPointsChannel,
  isPointsMarkType
} from './attributes/helpers';
import {
  getLineSegmentConfigs,
  getLinePointsFromSegments,
  parseCollectionMarkAttributes,
  getConnectLineSegmentConfigs,
  removeSegmentAttrs
} from './attributes/line';
import type {
  BaseEncodeSpec,
  BaseSingleEncodeSpec,
  IElement,
  IMark,
  MarkElementItem,
  MarkFunctionType,
  MarkKeySpec,
  MarkSpec,
  MarkType,
  StateProxyEncodeSpec
} from '../types';
import type { IGraphic, ILine, IGraphicAttribute } from '@visactor/vrender-core';
// eslint-disable-next-line no-duplicate-imports
import { CustomPath2D } from '@visactor/vrender-core';
import { invokeFunctionType, parseField } from '../parse/util';

export class Element implements IElement {
  mark: IMark;

  key: string;
  groupKey?: string;
  data: any[] = null;

  states: string[] = [];

  diffState: DiffState = DiffState.enter;
  // Element should be reserved as long as it need to animate
  isReserved: boolean = false;

  runtimeStatesEncoder: BaseEncodeSpec = null;

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
    const attrTransforms = this.mark.getAttributeTransforms();

    this.graphicItem = this.mark.addGraphicItem(
      attrTransforms ? transformAttributes(attrTransforms, attributes, this) : attributes,
      this.groupKey
    );

    if (!this.graphicItem) {
      return;
    }

    const { graphicName } = this.mark.getSpec();
    if (isString(graphicName)) {
      this.graphicItem.name = graphicName;
    } else if (isFunction(graphicName)) {
      this.graphicItem.name = graphicName(this);
    }

    // 统一读取mark中是否可交互的配置
    this.graphicItem[BridgeElementKey] = this;
    if (attrTransforms) {
      this.graphicItem.onBeforeAttributeUpdate = (attributes: any) => {
        // mark might be released
        if (!this.mark) {
          return attributes;
        }
        const graphicAttributes = transformAttributes(attrTransforms, attributes, this);
        return graphicAttributes;
      };
    }

    // transform initial attributes
    this.clearGraphicAttributes();
    if (this.mark.needAnimate()) {
      this.setPrevGraphicAttributes(null);
      this.setNextGraphicAttributes(Object.assign({}, attributes));
      this.setFinalGraphicAttributes(Object.assign({}, attributes));
    }
  }

  updateGraphicItem() {
    if (!this.graphicItem) {
      return;
    }
    if (this.diffState === DiffState.exit) {
      (this.graphicItem as any).releaseStatus = 'willRelease';
    } else {
      (this.graphicItem as any).releaseStatus = undefined;
    }

    const stateAnimation = this.mark.animate?.getAnimationConfigs('state');
    if (stateAnimation && stateAnimation.length !== 0) {
      (this.graphicItem as any).stateAnimateConfig = stateAnimation[0].originConfig;
    }
  }

  getGraphicItem() {
    return this.graphicItem;
  }

  removeGraphicItem() {
    // stop all animation when releasing including normal animation & morphing animation
    if (this.graphicItem) {
      this.graphicItem.animates?.forEach?.((animate: any) => animate.stop());
    }

    if (this.graphicItem) {
      removeGraphicItem(this.graphicItem);
      this.graphicItem[BridgeElementKey] = null;
      this.graphicItem = null;
    }
  }

  resetGraphicItem() {
    if (this.graphicItem) {
      this.graphicItem = null;
    }
  }

  getBounds() {
    // FIXME: 没有更新 bounds 时拿到的 bound 可能为 null
    return this.graphicItem?.AABBBounds as IBounds;
  }

  getStates() {
    return this.states;
  }

  updateData(groupKey: string | null, data: any[], key: MarkKeySpec) {
    this.mark.emit(HOOK_EVENT.BEFORE_ELEMENT_UPDATE_DATA, { groupKey, data, key }, this);
    this.data = data;
    const keyGetter = parseField(key);
    this.items = data.map(datum => {
      const key = keyGetter(datum);
      const item = {
        datum,
        key,
        view: this.mark.view,
        nextAttrs: {}
      };

      return item;
    });

    this.groupKey = groupKey;
    this.key = this.mark.isCollectionMark() ? groupKey : this.items?.[0].key;

    this.mark.emit(HOOK_EVENT.AFTER_ELEMENT_UPDATE_DATA, { groupKey, data, key }, this);
    return this.items;
  }

  state(markState: MarkFunctionType<string | string[]>, parameters?: any) {
    const isCollectionMark = this.mark.isCollectionMark();

    const prevStateValues = this.states;
    const newStateValues = array(invokeFunctionType(markState, parameters, this.getDatum(), this));
    const stateSort = this.mark.getSpec()?.stateSort;

    if (stateSort && newStateValues.length) {
      newStateValues.sort(stateSort);
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

  encodeGraphic(attrs?: any) {
    this.coordinateTransformEncode(this.items);

    const graphicAttributes = this.transformElementItems(this.items, this.mark.markType);

    if (attrs) {
      Object.assign(graphicAttributes, attrs);
    }

    if (!this.graphicItem) {
      this.initGraphicItem(graphicAttributes);
    } else {
      this.graphicItem.clearStates();
      // 更新数据流后，states计算不缓存
      this.graphicItem.states = {};
      this.graphicItem.stateProxy = null;

      if (MARK_OVERLAP_HIDE_KEY in this.graphicItem.attribute && 'visible' in graphicAttributes) {
        delete this.graphicItem.attribute[MARK_OVERLAP_HIDE_KEY];
      }

      this.applyGraphicAttributes(graphicAttributes);
    }

    if ((this.diffState === DiffState.enter || this.diffState === DiffState.update) && this.states.length) {
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
    this._setCustomizedShape();
  }

  private _setCustomizedShape() {
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

  encodeItems(items: MarkElementItem[], encoders: BaseEncodeSpec, isReentered: boolean = false, parameters?: any) {
    const isCollectionMark = this.mark.isCollectionMark();
    // marshall encoder functions
    const updateEncoder = encoders[BuiltInEncodeNames.update];
    const enterEncoder = encoders[BuiltInEncodeNames.enter];
    const exitEncoder = encoders[BuiltInEncodeNames.exit];
    const onlyFullEncodeFirst = this.mark.isLargeMode() || (isCollectionMark && !this.mark.getSpec().enableSegments);

    if (this.diffState === DiffState.enter) {
      if (enterEncoder) {
        invokeEncoderToItems(this, items, enterEncoder, parameters, onlyFullEncodeFirst);
      }
      if (updateEncoder) {
        invokeEncoderToItems(this, items, updateEncoder, parameters, onlyFullEncodeFirst);
      }
    } else if (this.diffState === DiffState.update) {
      // if mark is reentered or mark is collection type, evaluate enter encode
      if ((isCollectionMark && enterEncoder) || isReentered) {
        invokeEncoderToItems(this, items, enterEncoder, parameters, onlyFullEncodeFirst);
      }
      if (updateEncoder) {
        invokeEncoderToItems(this, items, updateEncoder, parameters, onlyFullEncodeFirst);
      }
    } else if (this.diffState === DiffState.exit && exitEncoder) {
      // if mark is reentered, evaluate enter encode
      if (isReentered) {
        invokeEncoderToItems(this, items, enterEncoder, parameters, onlyFullEncodeFirst);
      }
      invokeEncoderToItems(this, items, exitEncoder, parameters, onlyFullEncodeFirst);
    }
  }

  protected coordinateTransformEncode(items: MarkElementItem[]) {
    if (!this.mark.coord || this.mark.markType === 'arc' || this.mark.disableCoordinateTransform === true) {
      return;
    }
    const coord = this.mark.coord.output() as IBaseCoordinate;

    items.forEach(item => {
      const nextAttrs = item.nextAttrs;
      const convertedPoint: IPointLike = coord.convert(nextAttrs);
      Object.assign(nextAttrs, convertedPoint);
    });
  }

  hasStateAnimation() {
    const stateAnimation = this.mark.animate?.getAnimationConfigs('state');
    return stateAnimation && stateAnimation.length > 0;
  }

  clearStates(hasAnimation?: boolean) {
    const stateAnimationEnable = isBoolean(hasAnimation) ? hasAnimation : this.hasStateAnimation();

    this.states = [];

    if (this.graphicItem) {
      this.graphicItem.clearStates(stateAnimationEnable);
    }

    if (this.runtimeStatesEncoder) {
      this.runtimeStatesEncoder = {};
    }
  }

  private _updateRuntimeStates(state: string, attrs: any) {
    if (!this.runtimeStatesEncoder) {
      this.runtimeStatesEncoder = {};
    }

    this.runtimeStatesEncoder[state] = attrs;
  }

  hasState(state: string) {
    return this.states && state && this.states.includes(state);
  }

  updateStates(states: Record<string, boolean | BaseSingleEncodeSpec>) {
    if (!this.graphicItem) {
      return false;
    }
    let nextStates = this.states.slice();
    const encode = (this.mark.getSpec() as MarkSpec).encode;
    let forceClearState = false;
    let hasUpdate = false;

    Object.keys(states).forEach(stateKey => {
      if (!stateKey) {
        return;
      }

      const stateValue = states[stateKey];
      const isRuntimeStateUpdate =
        isObject(stateValue) && !isObjEqual(stateValue, this.runtimeStatesEncoder?.[stateKey]);

      if (isRuntimeStateUpdate) {
        if (nextStates.includes(stateKey)) {
          forceClearState = true;
        } else {
          nextStates.push(stateKey);
        }
        this._updateRuntimeStates(stateKey, stateValue);
        hasUpdate = true;
      } else if (stateValue) {
        if (!nextStates.includes(stateKey) && encode?.[stateKey]) {
          nextStates.push(stateKey);
          hasUpdate = true;
        }
      } else {
        if (nextStates.length) {
          const newNextStates = nextStates.filter(state => state !== stateKey);

          if (newNextStates.length !== nextStates.length) {
            hasUpdate = true;
            nextStates = newNextStates;
          }

          if (this.runtimeStatesEncoder && this.runtimeStatesEncoder[stateKey]) {
            this.runtimeStatesEncoder[stateKey] = null;
          }
        }
      }
    });

    if (forceClearState) {
      this.graphicItem.clearStates();
    }

    if (hasUpdate) {
      this.useStates(nextStates);
      return true;
    }

    return false;
  }

  addState(state: string | string[], attrs?: BaseSingleEncodeSpec) {
    if (!this.graphicItem) {
      return false;
    }

    const isRuntimeStateUpdate = attrs && isString(state) && !isObjEqual(attrs, this.runtimeStatesEncoder?.[state]);
    if (isRuntimeStateUpdate) {
      const nextStates = this.states.slice();
      if (!nextStates.includes(state)) {
        nextStates.push(state);
      } else {
        this.graphicItem.clearStates();
      }
      this._updateRuntimeStates(state, attrs);

      this.useStates(nextStates);
      return true;
    }

    const encode = (this.mark.getSpec() as MarkSpec).encode;
    const states = array(state);
    const nextStates = states.reduce((nextStates: string[], stateName: string) => {
      if (stateName && !nextStates.includes(stateName) && encode?.[stateName]) {
        nextStates.push(stateName);
      }
      return nextStates;
    }, this.states.slice());

    if (nextStates.length !== this.states.length) {
      this.useStates(nextStates);

      return true;
    }

    return false;
  }

  removeState(state: string | string[]) {
    if (!this.graphicItem) {
      return false;
    }

    const states = array(state);

    if (!states.length) {
      return false;
    }

    const nextStates = this.states.filter(state => !states.includes(state));
    if (nextStates.length === this.states.length) {
      return false;
    }

    if (this.runtimeStatesEncoder) {
      states.forEach(state => {
        this.runtimeStatesEncoder[state] = null;
      });
    }
    this.useStates(nextStates);

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

    if (!encoder) {
      return {};
    }

    if (isFunction(encoder)) {
      return (encoder as StateProxyEncodeSpec)(this.getDatum(), this, stateName, nextStates);
    }

    if (!isRuntimeState && this.graphicItem.states?.[stateName]) {
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

    return graphicAttributes;
  };

  useStates(states: string[], hasAnimation?: boolean) {
    if (!this.graphicItem) {
      return false;
    }
    this.mark.emit(HOOK_EVENT.BEFORE_ELEMENT_STATE, { states }, this);

    const stateSort = this.mark.getSpec()?.stateSort;

    if (stateSort) {
      states.sort(stateSort);
    }
    this.states = states;

    const stateAnimationEnable = isBoolean(hasAnimation) ? hasAnimation : this.hasStateAnimation();

    this.graphicItem.stateProxy = this.getStateAttrs;
    this.graphicItem.useStates(this.states, stateAnimationEnable);

    this.mark.emit(HOOK_EVENT.AFTER_ELEMENT_STATE, { states }, this);

    return true;
  }

  protected diffAttributes(graphicAttributes: { [channel: string]: any }) {
    const diffResult = {};
    const finalGraphicAttributes = this.getFinalGraphicAttributes();
    for (const key in graphicAttributes) {
      if (!has(finalGraphicAttributes, key) || !isObjEqual(finalGraphicAttributes[key], graphicAttributes[key])) {
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

    let nextAttrs = item.nextAttrs;

    if (
      isPointsMarkType(markType) &&
      items &&
      items.length &&
      isNil(item.nextAttrs?.points) &&
      (computePoints === true || isValidPointsChannel(Object.keys(item.nextAttrs), this.mark.markType))
    ) {
      const markSpec = this.mark.getSpec();
      const lastPoints = this.getGraphicAttribute('points', false);
      const lastSegments = this.getGraphicAttribute('segments', false);
      const enableSegments = markSpec.enableSegments;
      const connectNullsEncoder = (this.mark.getSpec() as MarkSpec).encode?.[BuiltInEncodeNames.connectNulls];
      const itemNextAttrs = items.map(item => item.nextAttrs);
      const isProgressive = this.mark.isProgressive();
      nextAttrs = parseCollectionMarkAttributes(nextAttrs);

      if (markType === GrammarMarkType.line || markType === GrammarMarkType.area) {
        const linePoints = getLinePoints(items, true, lastPoints, markType === GrammarMarkType.area);

        // vchart新增了配置，用于开启线段解析；渐进渲染状态不支持线段样式；也不支持连接线
        if (isProgressive) {
          nextAttrs.segments = ((this.graphicItem as ILine)?.attribute?.segments ?? []).concat([
            { points: linePoints }
          ]);
        } else if (connectNullsEncoder) {
          nextAttrs.segments = getConnectLineSegmentConfigs(itemNextAttrs, linePoints, this);

          if (nextAttrs.segments && nextAttrs.segments.some((seg: any) => seg.isConnect)) {
            const connectStyle = invokeEncoder(connectNullsEncoder, this.getDatum(), this, this.mark.parameters());

            connectStyle &&
              nextAttrs.segments.forEach((seg: any) => {
                if (seg.isConnect) {
                  Object.assign(seg, connectStyle);
                }
              });
          }
          // when connectNulls, points need to be saved
          nextAttrs.points = linePoints;
        } else if (enableSegments) {
          const points = !linePoints || linePoints.length === 0 ? getLinePointsFromSegments(lastSegments) : linePoints;
          const segments = getLineSegmentConfigs(itemNextAttrs, points, this);

          if (segments) {
            nextAttrs.segments = segments;
            nextAttrs.points = null;
          } else {
            nextAttrs.segments = null;
            nextAttrs.points = points;
          }
          nextAttrs = removeSegmentAttrs(nextAttrs, this);
        } else {
          nextAttrs.points = linePoints;
          nextAttrs.segments = null;
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
    if (isEmpty(graphicAttributes)) {
      return;
    }

    if (this.mark.needAnimate()) {
      // If mark need animate, diff attributes.
      const nextGraphicAttributes = this.diffAttributes(graphicAttributes);
      const prevGraphicAttributes = this.getPrevGraphicAttributes() ?? {};
      const finalGraphicAttributes = this.getFinalGraphicAttributes() ?? {};

      Object.keys(nextGraphicAttributes).forEach(channel => {
        prevGraphicAttributes[channel] = this.getGraphicAttribute(channel);
        finalGraphicAttributes[channel] = nextGraphicAttributes[channel];
      });
      this.setNextGraphicAttributes(nextGraphicAttributes);
      this.setPrevGraphicAttributes(prevGraphicAttributes);
      this.setFinalGraphicAttributes(finalGraphicAttributes);

      // ignore loop animation final attributes
      const currentAnimators = this.mark.animate?.getElementAnimators(this).filter(animator => {
        if (animator.animationOptions.timeline.controlOptions?.ignoreLoopFinalAttributes) {
          return !animator.animationOptions.timeline.loop;
        }
        return true;
      });

      const animateGraphicAttributes = (currentAnimators || []).reduce((attributes, animator) => {
        return Object.assign(attributes, animator.getEndAttributes());
      }, {});
      const currentGraphicAttributes = Object.assign({}, animateGraphicAttributes, finalGraphicAttributes);

      // Apply next attributes to current graphic item immediately.
      // Scene graph tree should be handled like no animation exists in dataflow procedure.
      this.graphicItem.setAttributes(currentGraphicAttributes);
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

  /**
   * 在动画执行中获取图元最终的视觉通道结果
   * @param channel 视觉通道
   */
  getFinalAnimationAttribute(channel: string) {
    return this.getFinalGraphicAttributes()?.[channel] ?? this.getGraphicAttribute(channel);
  }
  getFinalAnimationAttributes() {
    return this.getFinalGraphicAttributes() ?? this.graphicItem.attribute;
  }

  protected setNextGraphicAttributes(attributes: { [channel: string]: any }) {
    (this.graphicItem as any).nextAttrs = attributes;
  }

  clearChangedGraphicAttributes() {
    if (this.graphicItem) {
      this.setPrevGraphicAttributes(null);
      this.setNextGraphicAttributes(null);
    }
  }

  clearGraphicAttributes() {
    if (this.graphicItem) {
      (this.graphicItem as any).prevAttrs && this.setPrevGraphicAttributes(null);
      (this.graphicItem as any).nextAttrs && this.setNextGraphicAttributes(null);
      (this.graphicItem as any).finalAttrs && this.setFinalGraphicAttributes(null);
    }
  }

  remove() {
    if (this.graphicItem) {
      removeGraphicItem(this.graphicItem);
      this.graphicItem = null;
    }
  }

  release() {
    this.removeGraphicItem();
    this.mark = null;
    this.data = null;
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
    return this.mark && this.mark.isCollectionMark() ? this.items ?? [] : this.items?.[0];
  }
  getDatum() {
    return this.mark && this.mark.isCollectionMark() ? this.data ?? [] : this.data?.[0];
  }
}
