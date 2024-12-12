import type { IGroup } from '@visactor/vrender-core';
import type { IBounds } from '@visactor/vutils';
import { isArray, isNil, isString, isValid } from '@visactor/vutils';
import { CollectionMarkType, DefaultKey, DefaultMarkData, Mark3DType } from '../graph/constants';
import {
  DiffState,
  GrammarMarkType,
  LayoutState,
  HOOK_EVENT,
  GrammarTypeEnum,
  BuiltInEncodeNames
} from '../graph/enums';
import type { GroupedData } from '../graph/mark/differ';
import { Differ, groupData } from '../graph/mark/differ';
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
  BaseSingleEncodeSpec
} from '../types';
import { isFieldEncode, isScaleEncode, parseEncodeType } from '../parse/mark';
import { getGrammarOutput, parseField, isFunctionType } from '../parse/util';
import { parseTransformSpec } from '../parse/transform';
import { invokeEncoder } from '../graph/mark/encode';
import { transformsByType } from '../graph/attributes';
import getExtendedEvents from '../graph/util/events-extend';
import type { IBaseScale } from '@visactor/vscale';
import { EVENT_SOURCE_VIEW } from './constants';
import { Element } from '../graph/element';

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

  group: IGroupMark | undefined;
  /** 非group mark，对应的容器节点 */
  graphicItem?: IGroup;
  graphicIndex: number;
  /** mark下的element，对应的父节点 */
  graphicParent?: IGroup;

  elements: IElement[] = [];
  elementMap: Map<string, IElement> = new Map();

  isUpdated: boolean = true;

  protected _groupEncodeResult: Record<string, any>;
  private _groupedData: GroupedData<any>;

  /** whether mark enter encode is updated  */
  protected _isReentered: boolean = false;

  private _context: any;

  private renderContext?: {
    large: boolean;
    parameters?: any;
    progressive?: ProgressiveContext;
    beforeTransformProgressive?: IProgressiveTransformResult;
  };
  animate: IAnimate;

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
      this.encodeState(state, {}, true);
    });

    // add new encode
    Object.keys(spec.encode ?? {}).forEach(state => {
      this.encodeState(state, (spec.encode as any)[state]);
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

    (this as any).reuseAnimate?.(mark);

    this._context = mark._context;
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
    // if ((this.spec?.layout as MarkBaseLayoutSpec)?.skipBeforeLayouted) {
    //   this.run();
    // }
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
    const transformData = this.evaluateTransform(this._getTransformsBeforeJoin(), data ?? DefaultMarkData, parameters);
    const progressiveTransform = transformData?.progressive;

    if (!progressiveTransform) {
      this.evaluateGroup(transformData);
      this.renderContext = this.parseRenderContext(transformData, parameters);
    } else {
      this.renderContext = { large: false };
    }

    if (this.renderContext?.progressive) {
      this.differ.reset();
      this.elementMap.clear();
      this.evaluateProgressive();
    } else {
      let inputData: any[] = null;
      if (progressiveTransform) {
        this.renderContext.parameters = parameters;
        this.renderContext.beforeTransformProgressive = transformData.progressive;
        inputData = transformData.progressive.output();

        if (transformData.progressive.canAnimate && transformData.progressive.unfinished()) {
          this.update(this.spec);
          return this;
        }
      } else {
        inputData = transformData;
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
    }

    this.update(this.spec);

    return this;
  }

  protected evaluateGroup(data: any[]) {
    if (this.markType === GrammarMarkType.group) {
      return;
    }
    const currentData = data ?? DefaultMarkData;
    const res = groupData(currentData, this.spec.groupBy, this.spec.groupSort);

    this._groupEncodeResult = null;
    this._groupedData = res;
  }

  protected _getTransformsAfterEncodeItems() {
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

  evaluate(data: any[], parameters: any) {
    this.evaluateMainTasks(data, parameters);
    if (!this.renderContext?.progressive) {
      this.evaluateTransform(this._getTransformsAfterEncode(), this.elements, parameters);
    }

    return this;
  }

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

  encode(channel: string | BaseSingleEncodeSpec, value?: MarkFunctionType<any> | boolean, clear?: boolean): this {
    return this.encodeState(DiffState.update, channel, value, clear);
  }

  encodeState(
    state: string,
    channel: string | BaseSingleEncodeSpec,
    value?: MarkFunctionType<any> | boolean,
    clear?: boolean
  ): this {
    if (state === DiffState.enter) {
      this._isReentered = true;
    }

    if ((this.spec.encode as any)[state]) {
      const lastEncoder = (this.spec.encode as any)[state];
      // detach last dependencies
      if (isFunctionType(lastEncoder)) {
        this.detach(parseEncodeType(lastEncoder, this.view));
      } else {
        const isSingleChannel = isString(channel);
        const clearAll = (isSingleChannel && clear) || (!isSingleChannel && value);

        if (clearAll) {
          Object.keys(lastEncoder).forEach(c => {
            this.detach(parseEncodeType(lastEncoder[c], this.view));
          });

          (this.spec.encode as any)[state] = {};
        } else if (isSingleChannel) {
          this.detach(parseEncodeType(lastEncoder[channel], this.view));
        } else {
          Object.keys(channel).forEach(c => {
            this.detach(parseEncodeType(lastEncoder[c], this.view));
          });
        }
      }
    }

    if (channel) {
      if (!(this.spec.encode as any)[state]) {
        (this.spec.encode as any)[state] = {};
      }

      // update encode & append new dependencies
      if (isString(channel)) {
        (this.spec.encode as any)[state][channel] = value;
        this.attach(parseEncodeType(value, this.view));
      } else if (isFunctionType(channel)) {
        (this.spec.encode as any)[state] = channel;
        this.attach(parseEncodeType(channel, this.view));
      } else if (channel) {
        Object.assign((this.spec.encode as any)[state], channel);
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
      'clipPath',
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
      'attributeTransforms',
      'skipTheme',
      'enableSegments',
      'stateSort',
      'graphicName',
      'overflow'
    ];
    if (config === null) {
      keys.forEach(key => {
        if (!isNil((this.spec as any)[key])) {
          (this.spec as any)[key] = undefined;
        }
      });
      return this;
    }

    keys.forEach(key => {
      if (!isNil((config as any)[key])) {
        (this.spec as any)[key] = (config as any)[key];
      }
    });

    return this;
  }

  context(context: any): this {
    this.spec.context = context;
    this._context = context;
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
        (scales as any)[ref.id() as string] = ref.output();
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

    Object.keys(encoders).forEach((state: string) => {
      const useEncoders = (encoders as any)[state];

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
    Object.keys(encoders).forEach((state: string) => {
      const useEncoders = (encoders as any)[state];

      if (!isFunctionType(useEncoders)) {
        Object.keys(useEncoders).forEach(channel => {
          if (isFieldEncode(useEncoders[channel])) {
            res[channel] = useEncoders[channel].field as string;
          }
        });
      }
    });

    return res;
  }

  protected init(stage: any, parameters: any) {
    if (!this._delegateEvent) {
      this._delegateEvent = (event: any, type: string) => {
        const extendedEvt = getExtendedEvents(this.view, event, type, EVENT_SOURCE_VIEW);
        const activeElement = event.element as IElement;
        if (activeElement?.mark === this) {
          this.emitGrammarEvent(type, extendedEvt, activeElement);
        }
      };
      this.initEvent();
    }

    (this as any).initAnimate?.(this.spec);

    if (!this.group) {
      // root mark will not be reused
      const group = getGrammarOutput(this.spec.group, parameters) as IGroupMark;
      this.group = group;
      if (group) {
        group.appendChild(this);
      }
    }

    const groupGraphicItem = this.group ? this.group.getGroupGraphicItem() : stage.defaultLayer;
    const markIndex = this.group?.children?.indexOf(this) ?? 0;
    if (this.markType !== GrammarMarkType.group) {
      if (!this.graphicItem) {
        const graphicItem = createGraphicItem(this, GrammarMarkType.group, {
          pickable: false,
          zIndex: this.spec.zIndex ?? 0,
          overflow: this.spec.overflow
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

      this.graphicParent.setAttributes({
        overflow: this.spec.overflow
      });
    }
    this.graphicIndex = markIndex;
  }

  protected update(spec: MarkSpec) {
    this.emit(HOOK_EVENT.BEFORE_MARK_UPDATE);
    this._context = this.spec.context;
    this.isUpdated = true;

    if (!this.renderContext.progressive) {
      (this as any).updateAnimate?.(spec);
    }

    if (this.markType !== GrammarMarkType.group) {
      if (!isNil(spec.zIndex)) {
        this.graphicItem.setAttribute('zIndex', spec.zIndex);
      }
      if (!isNil(spec.clip)) {
        this.graphicItem.setAttribute('clip', spec.clip);
      }
      if (!isNil(spec.clipPath)) {
        const paths = isArray(spec.clipPath) ? spec.clipPath : spec.clipPath(this.elements);

        if (paths && paths.length) {
          this.graphicItem.setAttribute('path', paths);
        } else {
          this.graphicItem.setAttributes({
            path: paths,
            clip: false
          });
        }
      }

      if (!isNil(spec.overflow)) {
        this.graphicItem.setAttribute('overflow', spec.overflow);
      }

      // only update interactive
      this.elementMap.forEach(element => {
        element.updateGraphicItem();
      });
    } else {
      // update group element graphic item attributes
      this.elementMap.forEach(element => {
        element.updateGraphicItem();
      });
    }
    this.emit(HOOK_EVENT.AFTER_MARK_UPDATE);
  }

  createElement() {
    return new Element(this);
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
        element = this.elementMap.has(elementKey) ? this.elementMap.get(elementKey) : this.createElement();
        if (element.diffState === DiffState.exit) {
          // force element to stop exit animation if it is reentered
          element.diffState = DiffState.enter;
          const animators = this.animate?.getElementAnimators(element, DiffState.exit);
          animators && animators.forEach(animator => animator.stop('start'));
        }

        element.diffState = DiffState.enter;
        const groupKey: string = isCollectionMark ? key : groupKeyGetter(data[0]);
        element.updateData(groupKey, data, keyGetter);
        this.elementMap.set(elementKey, element);
        elements.push(element);
      } else {
        // update
        element = this.elementMap.get(elementKey);
        if (element) {
          element.diffState = DiffState.update;
          const groupKey: string = isCollectionMark ? key : groupKeyGetter(data[0]);
          element.updateData(groupKey, data, keyGetter);
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
    } else {
      this.differ.setCurrentData(this._groupedData);
    }
    this.differ.doDiff();

    // Enter elements between dataflow start data and end data should be removed directly.
    enterElements.forEach(element => {
      this.elementMap.delete(isCollectionMark ? element.groupKey : `${element.groupKey}-${element.key}`);
      element.remove();
      element.release();
    });

    this.elements = elements;
    if (sort && this.elements.length >= 2) {
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

  protected evaluateGroupEncode(elements: IElement[], groupEncode: any, parameters: any) {
    if (!this._groupedData || !groupEncode) {
      return;
    }

    const res = {};

    this._groupedData.keys.forEach(key => {
      const el = elements.find(el => el.groupKey === key);

      if (!el) {
        return;
      }

      (res as any)[key] = invokeEncoder(groupEncode, el.items && el.items[0] && el.items[0].datum, el, parameters);
    });

    this._groupEncodeResult = res;

    return res;
  }

  protected getChannelsFromConfig(element?: IElement) {
    const spec = this.spec;

    return !isNil(spec.interactive) ? { pickable: spec.interactive } : null;
  }

  protected evaluateEncode(elements: IElement[], encoders: any, parameters: any, noGroupEncode?: boolean) {
    const initAttrs = this.getChannelsFromConfig();

    if (encoders) {
      this.emit(HOOK_EVENT.BEFORE_ELEMENT_ENCODE, { encoders, parameters }, this);

      const groupEncodeAttrs = noGroupEncode
        ? null
        : this.evaluateGroupEncode(elements, encoders[BuiltInEncodeNames.group], parameters);

      elements.forEach(element => {
        if (this.markType === GrammarMarkType.glyph && this._groupEncodeResult) {
          element.items.forEach(item => {
            item.nextAttrs = Object.assign(item.nextAttrs, initAttrs, this._groupEncodeResult[element.groupKey]);
          });
        } else if ((groupEncodeAttrs as any)?.[element.groupKey] && !this.isCollectionMark()) {
          element.items.forEach(item => {
            item.nextAttrs = Object.assign(item.nextAttrs, initAttrs, (groupEncodeAttrs as any)[element.groupKey]);
          });
        } else if (initAttrs) {
          element.items.forEach(item => {
            item.nextAttrs = Object.assign(item.nextAttrs, initAttrs);
          });
        }

        element.encodeItems(element.items, encoders, this._isReentered, parameters);

        if (
          this.isCollectionMark() &&
          (groupEncodeAttrs as any)?.[element.groupKey] &&
          isValid((groupEncodeAttrs as any)[element.groupKey].defined)
        ) {
          element.items.forEach(item => {
            item.nextAttrs.defined = (groupEncodeAttrs as any)[element.groupKey].defined;
          });
          delete (groupEncodeAttrs as any)[element.groupKey].defined;
        }
      });

      this._isReentered = false;

      this.evaluateTransform(this._getTransformsAfterEncodeItems(), elements, parameters);

      elements.forEach(element => {
        element.encodeGraphic(this.isCollectionMark() ? (groupEncodeAttrs as any)?.[element.groupKey] : null);
      });
      this.emit(HOOK_EVENT.AFTER_ELEMENT_ENCODE, { encoders, parameters }, this);
    } else {
      elements.forEach(element => {
        element.initGraphicItem(initAttrs);
      });
    }
  }

  addGraphicItem(attrs: any, groupKey?: string, newGraphicItem?: any) {
    const graphicItem: any = newGraphicItem ?? createGraphicItem(this, this.markType, attrs);

    if (!graphicItem) {
      return;
    }

    if (this.renderContext?.progressive) {
      let group: IGroup;

      if (this._groupedData) {
        const index = this._groupedData.keys.indexOf(groupKey);

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
      const groupedData = this._groupedData;

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

  canAnimateAfterProgressive() {
    return (
      this.renderContext &&
      this.renderContext.beforeTransformProgressive &&
      this.renderContext.beforeTransformProgressive.canAnimate()
    );
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
    if (this.renderContext && this.renderContext.progressive) {
      this.elements = [];

      (this.graphicParent as any).children.forEach((group: IGroup) => {
        group.incrementalClearChild();
      });
      (this.graphicParent as any).removeAllChild();
    }

    if (this.renderContext && this.renderContext.beforeTransformProgressive) {
      this.renderContext.beforeTransformProgressive.release();
    }

    this.renderContext = null;
  }

  restartProgressive() {
    if (this.renderContext && this.renderContext.progressive) {
      this.renderContext.progressive.currentIndex = 0;
    }
  }

  evaluateJoinProgressive() {
    const currentIndex = this.renderContext.progressive.currentIndex;
    const keyGetter = parseField(this.spec.key ?? (this.grammarSource as IData)?.getDataIDKey() ?? (() => DefaultKey));

    const elements: IElement[] = [];

    if (this.isCollectionMark()) {
      this._groupedData.keys.forEach((key, index) => {
        const data = this.renderContext.progressive.groupedData.get(key as string);
        const groupStep = this.renderContext.progressive.step;
        const dataSlice = data.slice(currentIndex * groupStep, (currentIndex + 1) * groupStep);

        if (currentIndex === 0) {
          const element = this.createElement();
          element.diffState = DiffState.enter;
          element.updateData(key as string, dataSlice, keyGetter);
          elements.push(element);
        } else {
          const element = this.elements[index];
          element.updateData(key as string, dataSlice, keyGetter);
          elements.push(element);
        }
      });

      return elements;
    }

    const groupElements: Record<string, IElement[]> = {};
    this._groupedData.keys.forEach(key => {
      const data = this.renderContext.progressive.groupedData.get(key as string);
      const groupStep = this.renderContext.progressive.step;
      const dataSlice = data.slice(currentIndex * groupStep, (currentIndex + 1) * groupStep);
      const group: IElement[] = [];

      dataSlice.forEach(entry => {
        const element = this.createElement();
        element.diffState = DiffState.enter;
        element.updateData(key as string, [entry], keyGetter);
        group.push(element);
        elements.push(element);
      });

      groupElements[key as string] = group;
    });

    return { groupElements, elements };
  }

  protected evaluateEncodeProgressive(elements: IElement[], encoders: any, parameters: any) {
    const progressiveIndex = this.renderContext.progressive.currentIndex;

    if (progressiveIndex === 0) {
      this.evaluateEncode(elements, encoders, parameters);

      if (
        progressiveIndex === 0 &&
        this._groupEncodeResult &&
        !this.isCollectionMark() &&
        this.markType !== GrammarMarkType.glyph
      ) {
        const firstElement = elements[0];
        const firstChild = firstElement.getGraphicItem();
        const group = firstChild?.parent;

        if (group) {
          if (this._groupEncodeResult[firstElement.groupKey]) {
            (group as IGroup).setTheme({ common: this._groupEncodeResult[firstElement.groupKey] });
          }
        }
      }
    } else {
      this.evaluateEncode(elements, encoders, parameters, true);
    }
  }

  evaluateProgressive() {
    if (this.renderContext?.beforeTransformProgressive) {
      const transform = this.renderContext.beforeTransformProgressive;
      transform.progressiveRun();
      const output = transform.output();

      if (transform.canAnimate) {
        if (transform.unfinished()) {
          return;
        }
        this.evaluateGroup(output);
      }

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

      this._groupedData.keys.forEach(key => {
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
      this.evaluateTransform(progressiveTransforms, this.elements, parameters);
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
    if (this.elements && this.elements[0] && this.elements[0].getGraphicItem) {
      return this.elements[0].getGraphicItem();
    }
  }

  getBounds() {
    return (this.graphicItem ? this.graphicItem.AABBBounds : this.getGroupGraphicItem()?.AABBBounds) as IBounds;
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

  getContext() {
    return this._context;
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
      stage && stage.on('*', this._delegateEvent);
    }
  }

  private releaseEvent() {
    if (this._delegateEvent) {
      const stage = this.view.renderer.stage();
      stage && stage.off('*', this._delegateEvent);
    }
  }

  clear() {
    this.releaseEvent();
    this.transforms = null;

    this.elementMap = null;
    this.elements = null;

    this.graphicItem = null;
    this.animate = null;

    this.group?.removeChild(this);
    this.group = null;
    super.clear();
  }

  prepareRelease() {
    // 清除数据，防止数据比对失败
    this.differ.setCurrentData(null);
    this.animate?.stop();
    this.elementMap.forEach(element => (element.diffState = DiffState.exit));
    this._finalParameters = this.parameters();
  }

  release() {
    this.releaseEvent();
    this.elements.forEach(element => element.release());
    this.differ = null;
    this.elements = [];
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
