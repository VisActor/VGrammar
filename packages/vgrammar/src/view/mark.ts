import type { IGroup, INode } from '@visactor/vrender';
import { isNil, isString } from '@visactor/vutils';
import { BridgeElementKey, CollectionMarkType, DefaultKey, DefaultMarkData, Mark3DType } from '../graph/constants';
import {
  DiffState,
  GrammarMarkType,
  LayoutState,
  HOOK_EVENT,
  GrammarTypeEnum,
  BuiltInEncodeNames
} from '../graph/enums';
import { Differ, groupData } from '../graph/mark/differ';
import { Animate } from '../graph/animation/animate';
import { createGraphicItem, removeGraphicItem } from '../graph/util/graphic';
import { GrammarBase } from './grammar-base';
import type {
  GrammarType,
  ICoordinate,
  IData,
  IElement,
  IGrammarBase,
  IGroupMark,
  IMark,
  IMarkConfig,
  IView,
  MarkAnimationSpec,
  MarkBaseLayoutSpec,
  MarkFunctionType,
  MarkKeySpec,
  MarkLayoutCallback,
  MarkLayoutSpec,
  MarkSortSpec,
  MarkSpec,
  MarkStateSpec,
  MarkType,
  TransformSpec,
  ProgressiveContext,
  IProgressiveTransformResult,
  Nil,
  IAnimate,
  MarkStateSortSpec,
  BaseSignleEncodeSpec
} from '../types';
import { isFieldEncode, isScaleEncode, parseEncodeType } from '../parse/mark';
import { getGrammarOutput, parseField, isFunctionType } from '../parse/util';
import { parseTransformSpec } from '../parse/transform';
import { createElement } from '../graph/util/element';
import { invokeEncoderToItems, splitEncoderInLarge } from '../graph/mark/encode';
import { isPositionOrSizeChannel, transformsByType } from '../graph/attributes';
import getExtendedEvents from '../graph/util/events-extend';
import type { IBaseScale } from '@visactor/vscale';
import { EVENT_SOURCE_VIEW } from './constants';

export class Mark extends GrammarBase implements IMark {
  readonly grammarType: GrammarType = 'mark';

  protected declare spec: MarkSpec;

  /**
   * only need to clear elements after join and render
   * but `handleRenderEnd` will be call after every render
   */
  protected needClear?: boolean;

  coord: ICoordinate;

  disableCoordinateTransform: boolean;

  // mark properties
  markType: MarkType;

  context: any;

  group: IGroupMark | undefined;
  /** 非group mark，对应的容器节点 */
  graphicItem?: IGroup;
  graphicIndex: number;
  /** mark下的element，对应的父节点 */
  graphicParent?: IGroup;

  elements: IElement[] = [];
  elementMap: Map<string, IElement> = new Map();

  isUpdated: boolean = true;

  private _groupKeys: string[];
  private _segmentIgnoreAttributes: string[];

  /** whether mark enter encode is updated  */
  private _isReentered: boolean = false;

  private renderContext?: {
    large: boolean;
    parameters?: any;
    progressive?: ProgressiveContext;
    beforeTransformProgressive?: IProgressiveTransformResult;
  };
  animate: IAnimate = new Animate(this, {});

  protected differ = new Differ([]);

  private _delegateEvent: (event: any, type: string) => void;

  private _finalParameters: any;

  constructor(view: IView, markType: MarkType, group?: IGroupMark) {
    super(view);
    this.markType = markType;
    this.spec.type = markType;
    this.spec.encode = { update: {} };
    this.spec.group = group;
    if (group) {
      this.group = group;
      this.attach(group);
      group.appendChild(this);
    }
  }

  parse(spec: MarkSpec) {
    super.parse(spec);

    // TODO: add group api
    if (this.spec.group) {
      const groupMark = isString(this.spec.group) ? this.view.getMarkById(this.spec.group) : this.spec.group;
      this.detach(groupMark);
    }
    const groupMark = isString(spec.group) ? this.view.getMarkById(spec.group) : spec.group;
    this.attach(groupMark);

    this.join(spec.from?.data, spec.key, spec.sort, spec.groupBy, spec.groupSort);
    this.coordinate(spec.coordinate);
    this.state(spec.state, this.spec.stateSort);

    // remove old encode
    Object.keys(this.spec.encode ?? {}).forEach(state => {
      this.encodeState(state, {});
    });

    // add new encode
    Object.keys(spec.encode ?? {}).forEach(state => {
      this.encodeState(state, spec.encode[state]);
    });
    this.animation(spec.animation);
    this.animationState(spec.animationState);
    this.morph(spec.morph, spec.morphKey, spec.morphElementKey);
    this.layout(spec.layout);
    this.configure(spec);
    this.transform(spec.transform);

    this.parseAddition(spec);

    this.spec = spec;
    this.markType = spec.type as MarkType;

    this.commit();
    return this;
  }

  parameters() {
    // apply last parameters after prepareRelease
    return this._finalParameters ?? super.parameters();
  }

  protected parseAddition(spec: MarkSpec) {
    return this;
  }

  reuse(grammar: IGrammarBase) {
    if (grammar.grammarType !== this.grammarType) {
      return this;
    }
    const mark = grammar as Mark;
    this.markType = mark.markType;
    this.coord = mark.coord;

    this.elementMap = mark.elementMap;
    this.elements = mark.elements;
    this.elementMap.forEach(element => (element.mark = this));

    this.differ = mark.differ;
    this.animate = mark.animate;
    this.animate.mark = this;

    this.context = mark.context;
    // set group in later evaluate progress
    this.graphicItem = mark.graphicItem;
    this.graphicIndex = mark.graphicIndex;
    this.graphicParent = mark.graphicParent;

    this.needClear = mark.needClear;
    this.isUpdated = mark.isUpdated;

    return this;
  }

  needLayout() {
    // 后续可以加上Visible 判断等
    return !isNil(this.spec.layout);
  }

  handleLayoutEnd() {
    if ((this.spec.layout as MarkBaseLayoutSpec)?.skipBeforeLayouted) {
      this.run();
    }
  }

  handleRenderEnd() {
    /**
     * only need to clear elements after join and render
     * but `handleRenderEnd` will be call after every render
     */
    if (!this.needClear) {
      return;
    }
    // clear exit elements
    this.cleanExitElements();
    // clear element channels
    this.elementMap.forEach(element => {
      if (element.diffState === DiffState.exit) {
        element.clearGraphicAttributes();
      } else {
        element.clearChangedGraphicAttributes();
      }
    });
    this.differ.updateToCurrent();
    this.needClear = false;
  }

  evaluateMainTasks(data: any[], parameters: any) {
    if (this.needSkipBeforeLayout() && this.view.getLayoutState() === LayoutState.before) {
      return this;
    }

    const stage = this.view.renderer?.stage();

    this.init(stage, parameters);
    const transformData = this.evaluateTransformSync(
      this._getTransformsBeforeJoin(),
      data ?? DefaultMarkData,
      parameters
    );
    let inputData = transformData?.progressive ? data : (transformData as any[]);

    this.evaluateGroup(inputData);

    this.renderContext = this.parseRenderContext(inputData, parameters);
    if (!this.renderContext.progressive) {
      if (transformData?.progressive) {
        this.renderContext.parameters = parameters;
        this.renderContext.beforeTransformProgressive = transformData.progressive;
        inputData = transformData.progressive.output();
      }
      this.emit(HOOK_EVENT.BEFORE_MARK_JOIN);
      // FIXME: better default upstream
      this.evaluateJoin(inputData);
      this.emit(HOOK_EVENT.AFTER_MARK_JOIN);

      this.emit(HOOK_EVENT.BEFORE_MARK_STATE);
      this.evaluateState(this.elements, this.spec.state, parameters);
      this.emit(HOOK_EVENT.AFTER_MARK_STATE);

      this.emit(HOOK_EVENT.BEFORE_MARK_ENCODE);
      this.evaluateEncode(this.elements, this._getEncoders(), parameters);
      this.emit(HOOK_EVENT.AFTER_MARK_ENCODE);
    } else {
      this.differ.reset();
      this.elementMap.clear();
      this.evaluateProgressive();
    }

    this.emit(HOOK_EVENT.BEFORE_MARK_UPDATE);
    this.update(this.spec);
    this.emit(HOOK_EVENT.AFTER_MARK_UPDATE);

    return this;
  }

  protected evaluateGroup(data: any[]) {
    if (this.markType === GrammarMarkType.group) {
      return;
    }

    const currentData = data ?? DefaultMarkData;
    const groupKeyGetter = parseField(this.spec.groupBy ?? (() => DefaultKey));
    const res = groupData(currentData, groupKeyGetter, this.spec.groupSort);
    const groupKeys = res.keys as string[];

    this._groupKeys = groupKeys;

    this.differ.setCurrentData(res);
  }

  private _getTransformsAfterEncodeItems() {
    return this.transforms && this.transforms.filter(entry => entry.markPhase === 'afterEncodeItems');
  }

  private _getTransformsAfterEncode() {
    return (
      this.transforms && this.transforms.filter(entry => isNil(entry.markPhase) || entry.markPhase === 'afterEncode')
    );
  }

  private _getTransformsBeforeJoin() {
    return this.transforms ? this.transforms.filter(entry => entry.markPhase === 'beforeJoin') : [];
  }

  async evaluate(data: any[], parameters: any) {
    this.evaluateMainTasks(data, parameters);
    if (!this.renderContext?.progressive) {
      await this.evaluateTransform(this._getTransformsAfterEncode(), this.elements, parameters);
    }

    return this;
  }

  evaluateSync = (data: any[], parameters: any) => {
    this.evaluateMainTasks(data, parameters);

    if (!this.renderContext?.progressive) {
      this.evaluateTransformSync(this._getTransformsAfterEncode(), this.elements, parameters);
    }

    return this;
  };

  output() {
    return this;
  }

  join(
    data: IData | string | Nil,
    key?: MarkKeySpec,
    sort?: MarkSortSpec,
    groupBy?: MarkKeySpec,
    groupSort?: MarkSortSpec
  ) {
    // set data source
    if (this.grammarSource) {
      this.detach(this.grammarSource);
      this.grammarSource = null;
    }
    this.spec.from = null;
    if (!isNil(data)) {
      if (isString(data)) {
        this.grammarSource = this.view.getDataById(data);
      } else {
        this.grammarSource = data;
      }
      this.spec.from = { data };
      this.attach(this.grammarSource);
    }

    // set key & sort
    this.spec.key = key;
    this.spec.sort = sort;
    this.spec.groupBy = groupBy;
    this.spec.groupSort = groupSort;

    this.commit();
    return this;
  }

  coordinate(coordinate: ICoordinate | string | Nil) {
    if (isString(coordinate)) {
      this.coord = this.view.getCoordinateById(coordinate);
    } else {
      this.coord = coordinate;
    }
    this.attach(this.coord);
    this.commit();
    return this;
  }

  state(state: MarkFunctionType<string | string[]> | Nil, stateSort?: MarkStateSortSpec) {
    this.spec.stateSort = stateSort;

    return this.setFunctionSpec(state, 'state');
  }

  encode(channel: string | BaseSignleEncodeSpec, value?: MarkFunctionType<any>): this {
    return this.encodeState(DiffState.update, channel, value);
  }

  encodeState(state: string, channel: string | BaseSignleEncodeSpec, value?: MarkFunctionType<any>): this {
    if (state === DiffState.enter) {
      this._isReentered = true;
    }

    if (!this.spec.encode[state]) {
      this.spec.encode[state] = {};
    } else {
      const lastEncoder = this.spec.encode[state];
      // detach last dependencies
      if (isFunctionType(lastEncoder)) {
        this.detach(parseEncodeType(lastEncoder, this.view));
      } else {
        if (isString(channel)) {
          this.detach(parseEncodeType(this.spec.encode[state][channel], this.view));
        } else {
          Object.keys(channel).forEach(c => {
            this.detach(parseEncodeType(this.spec.encode[state][c], this.view));
          });
        }
      }
    }
    // update encode & append new dependencies
    if (isString(channel)) {
      this.spec.encode[state][channel] = value;
      this.attach(parseEncodeType(value, this.view));
    } else if (isFunctionType(channel)) {
      this.spec.encode[state] = channel;
      this.attach(parseEncodeType(channel, this.view));
    } else {
      Object.assign(this.spec.encode[state], channel);
      if (channel) {
        Object.values(channel).forEach(channelEncoder => {
          this.attach(parseEncodeType(channelEncoder, this.view));
        });
      }
    }
    this.commit();
    return this;
  }

  protected _getEncoders() {
    return this.spec.encode ?? {};
  }

  animation(animationConfig: MarkAnimationSpec | Nil): this {
    this.spec.animation = animationConfig;
    return this;
  }

  animationState(animationState: MarkFunctionType<string> | Nil): this {
    return this.setFunctionSpec(animationState, 'animationState');
  }

  layout(layout: MarkLayoutSpec | MarkLayoutCallback | Nil): this {
    this.spec.layout = layout;
    this.commit();
    return this;
  }

  morph(enableMorph: boolean, morphKey?: string, morphElementKey?: string): this {
    this.spec.morph = enableMorph;
    this.spec.morphKey = morphKey;
    this.spec.morphElementKey = morphElementKey;
    return this;
  }

  transform(transforms: TransformSpec[] | Nil): this {
    const prevTransforms = parseTransformSpec(this.spec.transform, this.view);
    if (prevTransforms) {
      this.detach(prevTransforms.refs);
      this.transforms = [];
    }

    const nextTransforms = parseTransformSpec(transforms, this.view);
    if (nextTransforms) {
      this.attach(nextTransforms.refs);
      this.transforms = nextTransforms.transforms;
    }

    this.spec.transform = transforms;
    this.commit();
    return this;
  }

  configure(config: IMarkConfig | Nil): this {
    const keys = [
      'clip',
      'zIndex',
      'interactive',
      'context',
      'setCustomizedShape',
      'large',
      'largeThreshold',
      'progressiveStep',
      'progressiveThreshold',
      'support3d',
      'morph',
      'morphKey',
      'morphElementKey',
      'attributeTransforms'
    ];
    if (config === null) {
      keys.forEach(key => {
        if (!isNil(this.spec[key])) {
          this.spec[key] = undefined;
        }
      });
      return this;
    }

    keys.forEach(key => {
      if (!isNil(config[key])) {
        this.spec[key] = config[key];
      }
    });

    return this;
  }

  isCollectionMark(): boolean {
    return (CollectionMarkType as string[]).includes(this.markType);
  }

  needAnimate(): boolean {
    return !this.renderContext?.progressive && !isNil(this.spec.animation);
  }

  getAllElements(): IElement[] {
    const elements = this.elements.slice();
    this.elementMap.forEach(element => {
      // For most of time, exit elements will not be included in this.elements.
      // After prepareRelease is invoked, elements will all be marked as exited.
      if (element.diffState === DiffState.exit && !elements.includes(element)) {
        elements.push(element);
      }
    });
    if (this.spec.sort) {
      elements.sort((elementA, elementB) => {
        return this.spec.sort(elementA.getDatum(), elementB.getDatum());
      });
    }
    return elements;
  }

  getScales() {
    const scales = {};

    this.references.forEach((count, ref) => {
      if (ref.grammarType === GrammarTypeEnum.scale) {
        scales[ref.id() as string] = ref.output();
      }
    });

    return scales;
  }

  getScalesByChannel() {
    const encoders = this.spec.encode;

    if (!encoders) {
      return {};
    }

    const res: Record<string, IBaseScale> = {};
    const params = this.parameters();

    Object.keys(encoders).forEach(state => {
      const useEncoders = encoders[state];

      if (useEncoders && !isFunctionType(useEncoders)) {
        Object.keys(useEncoders).forEach(channel => {
          if (isScaleEncode(useEncoders[channel])) {
            res[channel] = getGrammarOutput(useEncoders[channel].scale, params);
          }
        });
      }
    });

    return res;
  }

  getFieldsByChannel() {
    const encoders = this.spec.encode;

    if (!encoders) {
      return {};
    }

    const res: Record<string, string> = {};
    Object.keys(encoders).forEach(state => {
      const useEncoders = encoders[state];

      if (!isFunctionType(useEncoders)) {
        Object.keys(useEncoders).forEach(channel => {
          if (isFieldEncode(useEncoders[channel])) {
            res[channel] = useEncoders[channel].field;
          }
        });
      }
    });

    return res;
  }

  protected init(stage: any, parameters: any) {
    if (!this._delegateEvent) {
      this._delegateEvent = (event: any, type: string) => {
        const activeElement = event.target?.[BridgeElementKey] as IElement;
        if (activeElement?.mark === this) {
          const extendedEvt = getExtendedEvents(this.view, event, activeElement, type, EVENT_SOURCE_VIEW);
          this.emitGrammarEvent(type, extendedEvt, activeElement);
        }
      };
      this.initEvent();
    }

    if (!this.animate) {
      this.animate = new Animate(this, this.spec.animation);
      if (this.needAnimate()) {
        this.animate.updateState(this.spec.animationState);
      }
    }

    if (!this.group) {
      // root mark will not be reused
      const group = getGrammarOutput(this.spec.group, parameters) as IGroupMark;
      this.group = group;
      if (group) {
        this.emit(HOOK_EVENT.BEFORE_ADD_VRENDER_MARK);
        group.appendChild(this);
        this.emit(HOOK_EVENT.AFTER_ADD_VRENDER_MARK);
      }
    }

    const groupGraphicItem = this.group ? this.group.getGroupGraphicItem() : stage.defaultLayer;
    const markIndex = this.group?.children?.indexOf(this) ?? 0;
    if (this.markType !== GrammarMarkType.group) {
      if (!this.graphicItem) {
        const graphicItem = createGraphicItem(this, GrammarMarkType.group, {
          pickable: false,
          zIndex: this.spec.zIndex ?? 0
        }) as IGroup;
        if (this.spec.support3d || (Mark3DType as string[]).includes(this.markType)) {
          graphicItem.setMode('3d');
        }
        graphicItem.name = `${this.id() || this.markType}`;
        this.graphicItem = graphicItem;
      }
      this.graphicParent = this.graphicItem;
      if (groupGraphicItem && (this.graphicIndex !== markIndex || this.graphicItem.parent !== groupGraphicItem)) {
        groupGraphicItem.insertIntoKeepIdx(this.graphicItem, markIndex);
      }
    } else {
      this.graphicParent = groupGraphicItem;
    }
    this.graphicIndex = markIndex;
  }

  protected update(spec: MarkSpec) {
    this.context = this.spec.context;
    this.isUpdated = true;

    if (!this.renderContext.progressive) {
      if (spec.animation) {
        this.animate.updateConfig(spec.animation);
      }
      this.animate.updateState(spec.animationState);
    }

    if (this.markType !== GrammarMarkType.group) {
      if (!isNil(spec.zIndex)) {
        this.graphicItem.setAttribute('zIndex', spec.zIndex);
      }
      if (!isNil(spec.clip)) {
        this.graphicItem.setAttribute('clip', spec.clip);
      }
      // only update interactive
      this.elementMap.forEach(element => {
        element.updateGraphicItem({
          interactive: spec.interactive
        });
      });
    } else {
      // update group element graphic item attributes
      this.elementMap.forEach(element => {
        element.updateGraphicItem({
          clip: spec.clip,
          zIndex: spec.zIndex,
          interactive: spec.interactive
        });
      });
    }
  }

  protected evaluateJoin(data: any[]) {
    this.needClear = true;
    const keyGetter = parseField(this.spec.key ?? (this.grammarSource as IData)?.getDataIDKey() ?? (() => DefaultKey));
    const groupKeyGetter = parseField(this.spec.groupBy ?? (() => DefaultKey));
    const sort = this.spec.sort;
    const isCollectionMark = this.isCollectionMark();

    const enterElements = new Set<IElement>(this.elements.filter(element => element.diffState === DiffState.enter));
    const elements: IElement[] = [];
    this.differ.setCallback((key, data, prevData) => {
      const elementKey: string = key as string;
      let element: IElement;
      if (isNil(data)) {
        // exit
        element = this.elementMap.get(elementKey);
        if (element) {
          element.diffState = DiffState.exit;
        }
      } else if (isNil(prevData)) {
        // enter
        element = this.elementMap.has(elementKey) ? this.elementMap.get(elementKey) : createElement(this);
        if (element.diffState === DiffState.exit) {
          // force element to stop exit animation if it is reentered
          element.diffState = DiffState.enter;
          const animators = this.animate.getElementAnimators(element, DiffState.exit);
          animators.forEach(animator => animator.stop('start'));
        }

        element.diffState = DiffState.enter;
        const groupKey: string = isCollectionMark ? key : groupKeyGetter(data[0]);
        element.updateData(groupKey, data, keyGetter, this.view);
        this.elementMap.set(elementKey, element);
        elements.push(element);
      } else {
        // update
        element = this.elementMap.get(elementKey);
        if (element) {
          element.diffState = DiffState.update;
          const groupKey: string = isCollectionMark ? key : groupKeyGetter(data[0]);
          element.updateData(groupKey, data, keyGetter, this.view);
          elements.push(element);
        }
      }
      enterElements.delete(element);
    });

    const currentData = data ?? DefaultMarkData;

    if (!isCollectionMark) {
      this.differ.setCurrentData(
        groupData(
          currentData,
          (datum: any) => {
            return `${groupKeyGetter(datum)}-${keyGetter(datum)}`;
          },
          undefined
        )
      );
    }
    this.differ.doDiff();

    // Enter elements between dataflow start data and end data should be removed directly.
    enterElements.forEach(element => {
      this.elementMap.delete(isCollectionMark ? element.groupKey : `${element.groupKey}-${element.key}`);
      element.remove();
      element.release();
    });

    this.elements = elements;
    if (sort) {
      this.elements.sort((elementA, elementB) => {
        return sort(elementA.getDatum(), elementB.getDatum());
      });
    }
  }

  protected evaluateState(elements: IElement[], stateSpec: MarkStateSpec, parameters: any): void {
    if (!stateSpec) {
      return;
    }

    elements.forEach(element => {
      element.state(stateSpec, parameters);
    });
  }

  getSegmentIgnoreAttributes() {
    return this._segmentIgnoreAttributes;
  }

  protected evaluateGroupEncode(elements: IElement[], groupEncode: any, parameters: any) {
    if (!this._groupKeys || !groupEncode) {
      return;
    }

    const res = {};

    this._groupKeys.forEach(key => {
      const el = elements.find(el => el.groupKey === key);

      if (!el) {
        return;
      }

      const nextAttrs = {};
      const items = [Object.assign({}, el.items?.[0], { nextAttrs })];
      invokeEncoderToItems(el, items, groupEncode, parameters);
      res[key] = nextAttrs;
    });

    return res;
  }

  protected evaluateEncode(elements: IElement[], encoders: any, parameters: any) {
    if (encoders) {
      this.emit(HOOK_EVENT.BEFORE_ELEMENT_ENCODE, { encoders, parameters }, this);
      const groupEncodeAttrs = this.evaluateGroupEncode(elements, encoders[BuiltInEncodeNames.group], parameters);

      elements.forEach(element => {
        if (groupEncodeAttrs?.[element.groupKey]) {
          element.items.forEach(item => {
            item.nextAttrs = Object.assign(item.nextAttrs, groupEncodeAttrs[element.groupKey]);
          });
        }

        element.encodeItems(element.items, encoders, this._isReentered, parameters);
      });
      // optimize segments parsing
      if (
        groupEncodeAttrs &&
        this.isCollectionMark() &&
        elements.length &&
        (elements[0]?.items?.[0]?.nextAttrs?.enableSegments ?? elements[0].getGraphicAttribute('enableSegments', false))
      ) {
        this._segmentIgnoreAttributes = Object.keys(groupEncodeAttrs[Object.keys(groupEncodeAttrs)[0]]);
      } else {
        this._segmentIgnoreAttributes = null;
      }
      this._isReentered = false;

      this.evaluateTransformSync(this._getTransformsAfterEncodeItems(), elements, parameters);

      elements.forEach(element => {
        element.encodeGraphic();
      });
      this.emit(HOOK_EVENT.AFTER_ELEMENT_ENCODE, { encoders, parameters }, this);
    } else {
      elements.forEach(element => {
        element.initGraphicItem();
      });
    }
  }

  addGraphicItem(attrs: any, groupKey?: string, newGraphicItem?: any) {
    const graphicItem: any = newGraphicItem ?? createGraphicItem(this, this.markType, attrs);

    this.emit(HOOK_EVENT.BEFORE_ADD_VRENDER_MARK);
    if (this.markType === GrammarMarkType.group) {
      graphicItem.name = `${this.id() || this.markType}`;

      this.graphicParent.insertIntoKeepIdx(graphicItem as unknown as INode, this.graphicIndex);
    } else if (this.renderContext?.progressive) {
      let group: IGroup;

      if (this._groupKeys) {
        const index = this._groupKeys.indexOf(groupKey);

        if (index >= 0) {
          group = this.graphicParent.getChildAt(index) as IGroup;
        }
      } else {
        group = this.graphicParent.at(0) as IGroup;
      }

      if (this.isCollectionMark()) {
        graphicItem.incremental = 1;
        group.appendChild(graphicItem);
      } else {
        group.incrementalAppendChild(graphicItem);
      }
    } else {
      (this.graphicParent as any).appendChild(graphicItem);
    }
    this.emit(HOOK_EVENT.AFTER_ADD_VRENDER_MARK);

    return graphicItem;
  }

  parseRenderContext(data: any[], parameters: any) {
    const enableProgressive =
      this.markType !== GrammarMarkType.group &&
      this.spec.progressiveStep > 0 &&
      this.spec.progressiveThreshold > 0 &&
      this.spec.progressiveStep < this.spec.progressiveThreshold;
    const large = this.spec.large && this.spec.largeThreshold > 0 && data.length >= this.spec.largeThreshold;

    if (enableProgressive) {
      const groupedData = this.differ.getCurrentData();

      if (
        groupedData &&
        groupedData.keys &&
        groupedData.keys.some(key => groupedData.data.get(key).length > this.spec.progressiveThreshold)
      ) {
        return {
          large,
          parameters,
          progressive: {
            data,
            step: this.spec.progressiveStep,
            currentIndex: 0,
            totalStep: groupedData.keys.reduce((total, key) => {
              return Math.max(Math.ceil(groupedData.data.get(key).length / this.spec.progressiveStep), total);
            }, 1),
            groupedData: groupedData.data as Map<string, any[]>
          }
        };
      }

      return { large };
    }

    return {
      large
    };
  }

  isProgressive() {
    return this.renderContext && (!!this.renderContext.progressive || !!this.renderContext.beforeTransformProgressive);
  }

  isDoingProgressive() {
    return (
      this.renderContext &&
      ((this.renderContext.progressive &&
        this.renderContext.progressive.currentIndex < this.renderContext.progressive.totalStep) ||
        (this.renderContext.beforeTransformProgressive && this.renderContext.beforeTransformProgressive.unfinished()))
    );
  }

  clearProgressive() {
    if (this.renderContext?.progressive) {
      this.elements = [];

      (this.graphicParent as any).children.forEach((group: IGroup) => {
        group.incrementalClearChild();
      });
      (this.graphicParent as any).removeAllChild();
    }

    if (this.renderContext?.beforeTransformProgressive) {
      this.renderContext.beforeTransformProgressive.release();
    }

    this.renderContext = null;
  }

  restartProgressive() {
    if (this.renderContext?.progressive) {
      this.renderContext.progressive.currentIndex = 0;
    }
  }

  evaluateJoinProgressive() {
    const currentIndex = this.renderContext.progressive.currentIndex;
    const keyGetter = parseField(this.spec.key ?? (this.grammarSource as IData)?.getDataIDKey() ?? (() => DefaultKey));

    const elements: IElement[] = [];

    if (this.isCollectionMark()) {
      this._groupKeys.forEach((key, index) => {
        const data = this.renderContext.progressive.groupedData.get(key);
        const groupStep = this.renderContext.progressive.step;
        const dataSlice = data.slice(currentIndex * groupStep, (currentIndex + 1) * groupStep);

        if (currentIndex === 0) {
          const element = createElement(this);
          element.diffState = DiffState.enter;
          element.updateData(key, dataSlice, keyGetter, this.view);
          elements.push(element);
        } else {
          const element = this.elements[index];
          element.updateData(key, dataSlice, keyGetter, this.view);
          elements.push(element);
        }
      });

      return elements;
    }

    const groupElements: Record<string, IElement[]> = {};
    this._groupKeys.forEach(key => {
      const data = this.renderContext.progressive.groupedData.get(key);
      const groupStep = this.renderContext.progressive.step;
      const dataSlice = data.slice(currentIndex * groupStep, (currentIndex + 1) * groupStep);
      const group: IElement[] = [];

      dataSlice.forEach(entry => {
        const element = createElement(this);
        element.diffState = DiffState.enter;
        element.updateData(key, [entry], keyGetter, this.view);
        group.push(element);
        elements.push(element);
      });

      groupElements[key] = group;
    });

    return { groupElements, elements };
  }

  protected evaluateEncodeProgressive(elements: IElement[], encoders: any, parameters: any) {
    if (!encoders) {
      elements.forEach(element => {
        element.initGraphicItem();
      });

      return;
    }

    const positionEncoders = Object.keys(encoders).reduce((res, state) => {
      if (
        encoders[state] &&
        (state === BuiltInEncodeNames.enter || state === BuiltInEncodeNames.exit || state === BuiltInEncodeNames.update)
      ) {
        res[state] = splitEncoderInLarge(this.markType, encoders[state], (this as any).glyphType).positionEncoder;
      }
      return res;
    }, {});
    const progressiveIndex = this.renderContext.progressive.currentIndex;
    const isCollection = this.isCollectionMark();

    this.emit(HOOK_EVENT.BEFORE_ELEMENT_ENCODE, { encoders, parameters }, this);
    const groupEncodeAttrs = this.evaluateGroupEncode(elements, encoders[BuiltInEncodeNames.group], parameters);

    elements.forEach((element, index) => {
      const onlyPos = progressiveIndex > 0 || (!isCollection && index > 0);
      if (!onlyPos && groupEncodeAttrs?.[element.groupKey]) {
        element.items.forEach(item => {
          item.nextAttrs = Object.assign(item.nextAttrs, groupEncodeAttrs[element.groupKey]);
        });
      }

      element.encodeItems(element.items, onlyPos ? positionEncoders : encoders, this._isReentered, parameters);
    });
    this._isReentered = false;

    this.evaluateTransformSync(this._getTransformsAfterEncodeItems(), elements, parameters);

    elements.forEach(element => {
      element.encodeGraphic();
    });

    this.emit(HOOK_EVENT.AFTER_ELEMENT_ENCODE, { encoders, parameters }, this);

    if (progressiveIndex === 0 && !isCollection) {
      const firstElement = elements[0];
      const firstChild = firstElement.getGraphicItem();
      const group = firstChild?.parent;

      if (group) {
        const attrs = firstChild.attribute;
        const theme = {};
        const itemAttrs = {};

        Object.keys(attrs).forEach(key => {
          if (['pickable', 'zIndex'].includes(key)) {
            // do nothing
          } else if (isPositionOrSizeChannel(this.markType, key)) {
            itemAttrs[key] = attrs[key];
          } else {
            theme[key] = attrs[key];
          }
        });

        (group as IGroup).setTheme({ common: theme });
        firstChild.initAttributes(itemAttrs);
      }
    }
  }

  evaluateProgressive() {
    if (this.renderContext?.beforeTransformProgressive) {
      this.renderContext.beforeTransformProgressive.progressiveRun();
      const output = this.renderContext.beforeTransformProgressive.output();

      this.emit(HOOK_EVENT.BEFORE_MARK_JOIN);
      // FIXME: better default upstream
      this.evaluateJoin(output);
      this.emit(HOOK_EVENT.AFTER_MARK_JOIN);

      this.emit(HOOK_EVENT.BEFORE_MARK_STATE);
      this.evaluateState(this.elements, this.spec.state, this.renderContext.parameters);
      this.emit(HOOK_EVENT.AFTER_MARK_STATE);

      this.emit(HOOK_EVENT.BEFORE_MARK_ENCODE);
      this.evaluateEncode(this.elements, this._getEncoders(), this.renderContext.parameters);
      this.emit(HOOK_EVENT.AFTER_MARK_ENCODE);
      return;
    }

    if (!this.renderContext?.progressive) {
      return;
    }
    const parameters = this.renderContext.parameters;

    this.emit(HOOK_EVENT.BEFORE_MARK_JOIN);
    const result = this.evaluateJoinProgressive();
    const elements = Array.isArray(result) ? result : result.elements;
    this.emit(HOOK_EVENT.AFTER_MARK_JOIN);

    if (this.renderContext.progressive.currentIndex === 0) {
      (this.graphicParent as any).removeAllChild();

      this._groupKeys.forEach(key => {
        const graphicItem = createGraphicItem(this, GrammarMarkType.group, {
          pickable: false,
          zIndex: this.spec.zIndex
        });
        graphicItem.incremental = this.renderContext.progressive.step;
        (this.graphicParent as any).appendChild(graphicItem);
      });

      this.elements = elements;
    } else {
      this.elements = this.elements.concat(elements);
    }

    this.emit(HOOK_EVENT.BEFORE_MARK_STATE);
    this.evaluateState(elements, this.spec.state, parameters);
    this.emit(HOOK_EVENT.AFTER_MARK_STATE);

    this.emit(HOOK_EVENT.BEFORE_MARK_ENCODE);
    if (Array.isArray(result)) {
      this.evaluateEncodeProgressive(elements, this._getEncoders(), parameters);
    } else {
      const groupElements = result.groupElements;
      Object.keys(groupElements).forEach(key => {
        this.evaluateEncodeProgressive(groupElements[key], this._getEncoders(), parameters);
      });
    }
    this.emit(HOOK_EVENT.AFTER_MARK_ENCODE);

    const progressiveTransforms = this._getTransformsAfterEncode()?.filter(entry => entry.canProgressive === true);

    if (progressiveTransforms?.length) {
      this.evaluateTransformSync(progressiveTransforms, this.elements, parameters);
    }

    this.renderContext.progressive.currentIndex += 1;
  }

  isLargeMode() {
    return this.renderContext && this.renderContext.large;
  }

  cleanExitElements() {
    this.elementMap.forEach((element, key) => {
      if (element.diffState === DiffState.exit && !element.isReserved) {
        this.elementMap.delete(key);
        element.remove();
        element.release();
      }
    });
  }

  getGroupGraphicItem() {
    return this.elements?.[0]?.getGraphicItem?.();
  }

  getBounds() {
    return this.graphicItem ? this.graphicItem.AABBBounds : this.elements?.[0]?.getGraphicItem?.()?.AABBBounds;
  }

  getMorphConfig(): { morph: boolean; morphKey: string; morphElementKey: string } {
    return {
      morph: this.spec.morph ?? false,
      morphKey: this.spec.morphKey,
      morphElementKey: this.spec.morphElementKey
    };
  }

  getAttributeTransforms() {
    return this.spec.attributeTransforms ?? transformsByType[this.markType];
  }

  protected needSkipBeforeLayout(): boolean {
    if ((this.spec.layout as MarkBaseLayoutSpec)?.skipBeforeLayouted === true) {
      return true;
    }
    let group = this.group;
    // if parent mark has been skipped, child marks should skip
    while (group) {
      if (group.getSpec().layout?.skipBeforeLayouted === true) {
        return true;
      }
      group = group.group;
    }
    return false;
  }

  private initEvent() {
    if (this._delegateEvent) {
      const stage = this.view.renderer.stage();
      stage.on('*', this._delegateEvent);
    }
  }

  private releaseEvent() {
    if (this._delegateEvent) {
      const stage = this.view.renderer.stage();
      stage && stage.off('*', this._delegateEvent);
    }
  }

  clear() {
    super.clear();
    this.transforms = null;

    this.elementMap = null;
    this.elements = null;

    this.graphicItem = null;
    this.animate = null;

    this.group?.removeChild(this);
    this.group = null;
  }

  prepareRelease() {
    this.animate.stop();
    this.elementMap.forEach(element => (element.diffState = DiffState.exit));
    this._finalParameters = this.parameters();
  }

  release() {
    this.releaseEvent();
    this.elements.forEach(element => element.release());
    this.elementMap.clear();
    this._finalParameters = null;

    if (this.animate) {
      this.animate.release();
    }

    if (this.graphicItem) {
      removeGraphicItem(this.graphicItem);
    }

    this.detachAll();

    super.release();
  }
}
