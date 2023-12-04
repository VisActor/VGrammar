import type { IBounds, ILogger } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { EventEmitter, debounce, isObject, isString, getContainerSize, Logger, array } from '@visactor/vutils';
import type { IColor } from '@visactor/vrender/es/core';
// eslint-disable-next-line no-duplicate-imports
import { vglobal } from '@visactor/vrender/es/core';
import type { CoordinateType } from '@visactor/vgrammar-coordinate';
import type { IElement } from './../types/element';
import type {
  MarkSpec,
  IData,
  ISignal,
  ViewSpec,
  IView,
  IViewOptions,
  IViewThemeConfig,
  IViewEventConfig,
  Hooks,
  IMark,
  EventSpec,
  GroupMarkSpec,
  BaseEventSpec,
  MarkType,
  GrammarScaleType,
  SignalFunctionType,
  IScale,
  IGrammarBase,
  IGroupMark,
  IGlyphMark,
  ICoordinate,
  BaseEventHandler,
  GlyphMarkSpec,
  IRecordedGrammars,
  IComponent,
  ComponentSpec,
  IRecordedTreeGrammars,
  IMarkTreeNode,
  IRunningConfig,
  IViewAnimate,
  ITheme,
  InteractionSpec,
  IInteraction
} from '../types/';
import { Data } from './data';
import { initializeEventConfig, permit, prevent } from './events';
import Dataflow from './dataflow';
import { traverseMarkTree } from '../graph/mark-tree';
import { BridgeElementKey } from '../graph/constants';
import CanvasRenderer from '../graph/canvas-renderer';
import getExtendedEvents from '../graph/util/events-extend';
import {
  BROWSER,
  NO_TRAP,
  SIGNAL_WIDTH,
  SIGNAL_HEIGHT,
  SIGNAL_PADDING,
  SIGNAL_AUTOFIT,
  SIGNAL_VIEW_WIDTH,
  SIGNAL_VIEW_HEIGHT,
  EVENT_SOURCE_VIEW,
  EVENT_SOURCE_WINDOW,
  SIGNAL_VIEW_BOX
} from './constants';
import { Signal } from './signal';
import {
  BuiltInSignalID,
  builtInSignals,
  normalizeMarkTree,
  normalizeRunningConfig,
  normalizePadding
} from '../parse/view';
import { parseHandler, parseEventSelector, generateFilterByMark, ID_PREFIX, NAME_PREFIX } from '../parse/event';
import { isGrammar, parseReference } from '../parse/util';
import { configureEnvironment } from '../graph/util/env';
import { GroupMark } from './group';
import { Mark } from './mark';
import { defaultDoLayout } from '../graph/layout/layout';
import { GlyphMark } from './glyph';
import type { IMorph } from '../types/morph';
import { Morph } from '../graph/animation/morph';
import { RecordedGrammars, RecordedTreeGrammars } from './grammar-record';
import { ViewAnimate } from './animate';
import type { IRenderer } from '../types/renderer';
import { ComponentEnum, HOOK_EVENT, LayoutState, GrammarMarkType } from '../graph/enums';
import type {
  IAxis,
  IDatazoom,
  IGrid,
  ILabel,
  ILegend,
  IPlayer,
  IScrollbar,
  ISlider,
  ITitle
} from '../types/component';
import { Text } from '../semantic-marks/text';
import { ThemeManager } from '../theme/theme-manager';
import { Factory } from '../core/factory';
import { Component } from './component';
import { isMarkType, removeGraphicItem } from '../graph/util/graphic';

/**
 * Create a new View instance from a VGrammar dataflow runtime specification.
 * The generated View will not immediately be ready for display. Callers
 * should also invoke the initialize method (e.g., to set the parent
 * DOM element in browser-based deployment) and then invoke the run
 * method to evaluate the dataflow graph. Rendering will automatically
 * be performed upon dataflow runs.
 * @constructor
 * @param {object} spec - The VGrammar dataflow runtime specification.
 */
export default class View extends EventEmitter implements IView {
  /** render element */
  container: HTMLElement;

  /** renderer */
  renderer: IRenderer;
  animate: IViewAnimate;
  rootMark: IGroupMark;

  /** life circle hooks */
  hooks: Hooks;

  logger: ILogger;

  grammars: IRecordedGrammars;

  private _isReleased: boolean;
  private _spec: ViewSpec;
  private _config: IViewThemeConfig;
  private _options: IViewOptions;

  private _cachedGrammars: IRecordedTreeGrammars;
  private _willMorphMarks: { prev: IMark[]; next: IMark[] }[];

  /** morph animate */
  private _morph: IMorph;

  private _eventConfig: IViewEventConfig;
  private _eventListeners: Array<{
    type: string;
    source: any;
    handler: any;
  }>;

  private _theme: ITheme;

  private _dataflow: Dataflow;
  /** 正在执行的dataflow */
  private _currentDataflow?: Promise<any>;
  /** 正在执行的任务 */
  private _running?: Promise<this>;

  /** 初次渲染或者更新spec，需要构建布局树 */
  private _needBuildLayoutTree?: boolean;
  /** 布局阶段 */
  private _layoutState?: LayoutState;

  /** 布局树，存储所有需要计算布局的mark元素 */
  private _layoutMarks?: IMark[];

  private _background?: IColor;
  private _eventCache: Record<string, () => void>;
  /** 当前是否存在增量渲染元素 */
  private _progressiveMarks?: IMark[];
  private _progressiveRafId?: number;
  private _observer: ResizeObserver = null;
  private _boundInteractions?: IInteraction[];

  static useRegisters(comps: (() => void)[]) {
    comps.forEach((fn: () => void) => {
      fn();
    });
  }

  constructor(options: IViewOptions = {}, config: IViewThemeConfig = {}) {
    super();
    this._config = config;
    this._options = Object.assign(
      {
        mode: BROWSER
      },
      options
    );
    this.initialize();
  }
  // emit: <T extends EventEmitter.EventNames<string | symbol>>(
  //   event: T,
  //   ...args: EventEmitter.EventArgs<string | symbol, T>
  // ) => boolean;

  // --- Lookup Grammars ---

  getGrammarById(id: string) {
    return this.grammars.getGrammar(id);
  }
  getSignalById<T>(id: string): ISignal<T> | null {
    return this.grammars.getSignal(id);
  }
  getDataById(id: string): IData | null {
    return this.grammars.getData(id);
  }
  getScaleById(id: string): IScale | null {
    return this.grammars.getScale(id);
  }
  getCoordinateById(id: string) {
    return this.grammars.getCoordinate(id);
  }
  getMarkById(id: string): IMark | null {
    return this.grammars.getMark(id);
  }

  getCustomizedById(id: string): IGrammarBase | null {
    return this.grammars.getCustomized(id);
  }

  getGrammarsByName(name: string) {
    return this.grammars.filter(grammar => grammar.name() === name);
  }

  getGrammarsByType(grammarType: string) {
    return this.grammars.filter(grammar => grammar.grammarType === grammarType);
  }
  getMarksByType(markType: string) {
    return this.grammars.getAllMarks().filter(mark => mark.markType === markType);
  }
  getMarksByName(name: string): IMark[] | null {
    return this.grammars.getAllMarks().filter(mark => mark.name() === name);
  }
  getMarksBySelector(selector: string | string[] | IMark | IMark[]): IMark[] | null {
    if (!selector) {
      return null;
    }
    const selectors = array(selector);
    let res: IMark[] = [];

    selectors.forEach(selectorStr => {
      if (isGrammar(selectorStr)) {
        res = res.concat(selectorStr);
        return;
      }

      if (selectorStr[0] === ID_PREFIX) {
        res = res.concat(this.getMarkById(selectorStr.slice(1)));
      }

      if (selectorStr[0] === NAME_PREFIX) {
        res = res.concat(this.getMarksByName(selectorStr.slice(1)));
      }

      if (isMarkType(selectorStr)) {
        res = res.concat(this.getMarksByType(selectorStr));
      }
    });

    return res;
  }

  // --- Grammar ---

  private updateSignal<T>(signal: string | ISignal<T>, value: T) {
    if (isString(signal)) {
      signal = this.getSignalById<T>(signal);
    }
    signal.set(value);
    this.commit(signal);
  }

  signal<T>(value?: T, update?: SignalFunctionType<T>): ISignal<T> {
    const signal: ISignal<T> = new Signal<T>(this);
    if (arguments.length >= 1) {
      signal.value(value);
    }
    if (arguments.length >= 2) {
      signal.update(update);
    }
    this.grammars.record(signal);
    this._dataflow.add(signal);
    return signal;
  }

  data(values?: any[]): IData {
    const data: IData = new Data(this, values);
    this.grammars.record(data);
    this._dataflow.add(data);
    return data;
  }

  scale(type: GrammarScaleType) {
    const scale = Factory.createGrammar('scale', this, type) as IScale;

    if (scale) {
      this.grammars.record(scale);
      this._dataflow.add(scale);
    }
    return scale;
  }

  coordinate(type: CoordinateType) {
    const coordinate = Factory.createGrammar('coordinate', this, type) as ICoordinate;

    if (coordinate) {
      this.grammars.record(coordinate);
      this._dataflow.add(coordinate);
    }
    return coordinate;
  }

  mark(
    type: MarkType,
    group?: IGroupMark | string,
    markOptions?: { glyphType?: string; componentType?: string; mode?: '2d' | '3d' }
  ) {
    const groupMark = isString(group) ? (this.getMarkById(group) as IGroupMark) : group;

    let mark: IMark;
    switch (type) {
      case GrammarMarkType.group:
        mark = new GroupMark(this, groupMark);
        break;
      case GrammarMarkType.glyph:
        mark = new GlyphMark(this, markOptions?.glyphType, groupMark);
        break;
      // components
      case GrammarMarkType.component:
        mark = Factory.hasComponent(markOptions?.componentType)
          ? Factory.createComponent(markOptions?.componentType, this, groupMark, markOptions?.mode)
          : new Component(this, markOptions?.componentType, groupMark, markOptions?.mode);
        break;
      case GrammarMarkType.text:
        mark = new Text(this, type, groupMark);
        break;
      default:
        mark = Factory.hasMark(type) ? Factory.createMark(type, this, groupMark) : new Mark(this, type, groupMark);
    }
    this.grammars.record(mark);
    this._dataflow.add(mark);
    return mark;
  }

  group(group?: IGroupMark | string) {
    return this.mark(GrammarMarkType.group, group) as IGroupMark;
  }

  glyph(glyphType: string, group: IGroupMark | string) {
    return this.mark(GrammarMarkType.glyph, group, { glyphType }) as IGlyphMark;
  }

  component(componentType: string, group: IGroupMark | string, mode: '2d' | '3d' = '2d') {
    return this.mark(GrammarMarkType.component, group, { componentType, mode }) as IComponent;
  }

  axis(group: IGroupMark | string, mode: '2d' | '3d' = '2d') {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.axis, mode }) as IAxis;
  }

  grid(group: IGroupMark | string, mode: '2d' | '3d' = '2d') {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.grid, mode }) as IGrid;
  }

  legend(group: IGroupMark | string) {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.legend }) as ILegend;
  }

  slider(group: IGroupMark | string) {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.slider }) as ISlider;
  }

  label(group: IGroupMark | string) {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.label }) as ILabel;
  }

  datazoom(group: IGroupMark | string) {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.datazoom }) as IDatazoom;
  }

  player(group: IGroupMark | string) {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.player }) as IPlayer;
  }

  title(group: IGroupMark | string) {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.title }) as ITitle;
  }

  scrollbar(group: IGroupMark | string) {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.scrollbar }) as IScrollbar;
  }

  customized(type: string, spec: any) {
    const grammar = Factory.createGrammar(type, this, spec?.type);

    if (grammar) {
      grammar.parse(spec);
      this.grammars.record(grammar);
      this._dataflow.add(grammar);
      return grammar;
    }
  }

  addGrammar(grammar: IGrammarBase) {
    if (this.grammars.find(storedGrammar => storedGrammar.uid === grammar.uid)) {
      return this;
    }
    this.grammars.record(grammar);
    this._dataflow.add(grammar);
    grammar.parse(grammar.getSpec());

    // update layout tree after grammar update
    this._needBuildLayoutTree = true;
    return this;
  }

  removeGrammar(grammar: string | IGrammarBase) {
    const recordedGrammar = isString(grammar) ? this.getGrammarById(grammar) : grammar;
    if (!recordedGrammar || !this.grammars.find(storedGrammar => storedGrammar.uid === recordedGrammar.uid)) {
      return this;
    }
    if (recordedGrammar.grammarType === 'mark') {
      (recordedGrammar as IMark).prepareRelease();
    }
    this._cachedGrammars.record(recordedGrammar);
    this._dataflow.remove(recordedGrammar);
    this.grammars.unrecord(recordedGrammar);

    // update layout tree after grammar update
    this._needBuildLayoutTree = true;
    return this;
  }

  removeAllGrammars() {
    this.grammars.traverse(grammar => {
      if (grammar.grammarType === 'signal' && BuiltInSignalID.includes(grammar.id())) {
        return;
      } else if (grammar.grammarType === 'mark' && grammar.id() === 'root') {
        return;
      }
      this.removeGrammar(grammar);
    });
    return this;
  }

  removeAllGraphicItems() {
    this.traverseMarkTree((mark: IMark) => {
      if (mark.graphicItem) {
        removeGraphicItem(mark.graphicItem);
        mark.elementMap.forEach(element => {
          element.resetGraphicItem();
        });
        mark.graphicItem = null;
      }
    });

    return this;
  }

  // --- Handle Spec ---

  parseSpec(spec: ViewSpec) {
    this.emit(HOOK_EVENT.BEFORE_PARSE_VIEW);
    this._spec = spec;
    normalizeMarkTree(spec);

    if (spec.theme) {
      this.theme(spec.theme);
    } else {
      this.theme(ThemeManager.getDefaultTheme());
    }

    if (spec.width) {
      this.width(spec.width);
    }

    if (spec.height) {
      this.height(spec.height);
    }

    this.padding(spec.padding ?? this._options.padding ?? this._theme.padding);

    if (!this.width() || !this.height()) {
      const size = this._getContainerSize();

      if (size) {
        this.updateSignal(SIGNAL_WIDTH, size.width);
        this.updateSignal(SIGNAL_HEIGHT, size.height);
      }
    }

    if (spec.signals?.length) {
      spec.signals.forEach(signal => {
        this.signal().parse(signal);
      });
    }

    if (spec.data?.length) {
      spec.data.forEach(data => {
        this.data(null).parse(data);
      });
    }

    if (spec.coordinates?.length) {
      spec.coordinates.forEach(coordinate => {
        this.coordinate(coordinate.type)?.parse(coordinate);
      });
    }

    if (spec.scales?.length) {
      spec.scales.forEach(scale => {
        this.scale(scale.type)?.parse(scale);
      });
    }

    const customizedGrammars = Factory.getGrammars();

    Object.keys(customizedGrammars).forEach(key => {
      const { specKey } = customizedGrammars[key];

      if (spec[specKey]?.length) {
        spec[specKey].forEach((specValue: any) => {
          this.customized(key, specValue);
        });
      }
    });

    if (spec.marks?.length) {
      spec.marks.forEach(mark => {
        this.parseMarkSpec(mark);
      });
    }

    if (spec.events?.length) {
      spec.events.forEach(eventConfig => {
        this.event(eventConfig);
      });
    }

    if (spec.interactions?.length) {
      spec.interactions.forEach(interaction => {
        this.interaction(interaction.type, interaction);
      });
    }

    if (spec.animation === false) {
      this.animate.disable();
    } else {
      this.animate.enable();
    }

    this.emit(HOOK_EVENT.AFTER_PARSE_VIEW);

    // update layout tree after update spec
    this._needBuildLayoutTree = true;
    this._layoutState = LayoutState.before;

    return this;
  }

  updateSpec(spec: ViewSpec) {
    this.removeAllInteractions();
    this.removeAllGrammars();
    return this.parseSpec(spec);
  }

  private parseBuiltIn() {
    // 创建内置的 Signal
    builtInSignals(this._options, this._config, this.getCurrentTheme()).forEach(signalSpec => {
      const signal = this.signal().parse(signalSpec);
      if (signalSpec.value) {
        signal.set(signalSpec.value);
      }
    });

    const rootMark: GroupMarkSpec = {
      id: 'root',
      type: 'group',
      encode: {
        enter: { x: 0, y: 0 },
        update: {
          width: { signal: 'width' },
          height: { signal: 'height' }
        }
      }
    };
    this.parseMarkSpec(rootMark);
    this.rootMark = this.getMarkById('root') as IGroupMark;
  }

  private parseMarkSpec(spec: MarkSpec) {
    const markOptions =
      spec.type === GrammarMarkType.glyph
        ? { glyphType: (spec as GlyphMarkSpec).glyphType }
        : spec.type === GrammarMarkType.component
        ? { componentType: (spec as ComponentSpec).componentType, mode: (spec as ComponentSpec).mode }
        : null;
    this.mark(spec.type, spec.group, markOptions).parse(spec);
    (spec as GroupMarkSpec).marks?.forEach(childSpec => {
      this.parseMarkSpec(childSpec);
    });
  }

  // --- Theme API ---
  theme(theme: ITheme | string) {
    if (isString(theme)) {
      this._theme = ThemeManager.getTheme(theme) ?? ThemeManager.getDefaultTheme();
    } else {
      this._theme = theme;
    }

    if (this._theme) {
      this.background(this._spec?.background ?? this._options.background ?? this._theme.background);
      this.padding(this._spec?.padding ?? this._options.padding ?? this._theme.padding);
      this.renderer.stage()?.setTheme?.(Object.assign({}, this._theme.marks));
    } else {
      this.background(this._spec?.background ?? this._options.background);
      this.padding(this._spec?.padding ?? this._options.padding);
    }

    return this;
  }

  getCurrentTheme() {
    return this._theme;
  }
  async setCurrentTheme(theme: ITheme | string, render: boolean = true) {
    if (this._isReleased) {
      return;
    }
    this.theme(theme);
    // trigger encode for all marks
    this.grammars.getAllMarks().forEach(mark => {
      mark.commit();
    });

    if (render) {
      await this.evaluate();

      if (this._isReleased) {
        return;
      }
      // FIXME: trigger render
      this.renderer.render(true);
    } else {
      await this._dataflow.evaluate();
    }

    return this;
  }

  // --- Global Configure ---

  background(value?: IColor) {
    if (arguments.length) {
      this._background = value;
      this.renderer.background(value);
      return value;
    }
    return this._background;
  }

  width(value?: number) {
    const signal = this.getSignalById<number>(SIGNAL_WIDTH);
    if (arguments.length) {
      this._options.width = value;
      this.updateSignal(signal, value);
      return value;
    }
    return signal.output() as number;
  }

  height(value?: number) {
    const signal = this.getSignalById<number>(SIGNAL_HEIGHT);
    if (arguments.length) {
      this._options.height = value;
      this.updateSignal(signal, value);
      return value;
    }
    return signal.output() as number;
  }

  viewWidth(value?: number) {
    const signal = this.getSignalById<number>(SIGNAL_VIEW_WIDTH);
    if (arguments.length) {
      // view width depends on canvas width
      const padding = this.padding();
      this.width(value + padding.left + padding.right);
      return value;
    }
    return signal.output() as number;
  }

  viewHeight(value?: number) {
    const signal = this.getSignalById<number>(SIGNAL_VIEW_HEIGHT);
    if (arguments.length) {
      // view height depends on canvas height
      const padding = this.padding();
      this.height(value + padding.top + padding.bottom);
      return value;
    }
    return signal.output() as number;
  }

  padding(value?: number | { top?: number; left?: number; right?: number; bottom?: number }) {
    const signal = this.getSignalById<{ top: number; left: number; right: number; bottom: number }>(SIGNAL_PADDING);
    if (arguments.length) {
      const padding = normalizePadding(value);
      this.updateSignal(signal, padding);
      return padding;
    }
    return normalizePadding(signal.output());
  }

  autoFit(value?: boolean) {
    const signal = this.getSignalById<boolean>(SIGNAL_AUTOFIT);
    if (arguments.length) {
      this.updateSignal(signal, value);
      return value;
    }
    return signal.output() as boolean;
  }

  getViewBox() {
    const signal = this.getSignalById<IBounds>(SIGNAL_VIEW_BOX);

    return signal?.output() as IBounds;
  }

  // --- Layout ---

  updateLayoutTag() {
    this._layoutState = LayoutState.before;
    return this;
  }

  getLayoutState() {
    return this._layoutState;
  }

  private buildLayoutTree() {
    const markMap: Record<number, boolean> = {};
    const rootMarks: IMark[] = [];

    this.traverseMarkTree(
      (mark: IMark) => {
        markMap[mark.id()] = true;

        if (mark.group) {
          if (!markMap[mark.group.id()]) {
            rootMarks.push(mark);
          }
        } else {
          rootMarks.push(mark);
        }

        if (mark.markType === GrammarMarkType.group) {
          (mark as IGroupMark).updateLayoutChildren();
        }
      },
      (mark: IMark) => mark.needLayout()
    );

    this._layoutMarks = rootMarks;
  }

  private doLayout() {
    const doLayout = this._options.doLayout || defaultDoLayout;
    if (doLayout && this._layoutMarks?.length) {
      this.emit(HOOK_EVENT.BEFORE_DO_LAYOUT);
      doLayout(this._layoutMarks, this._options, this);
      this.emit(HOOK_EVENT.AFTER_DO_LAYOUT);
    }
  }

  private handleLayoutEnd() {
    this.emit(HOOK_EVENT.BEFORE_MARK_LAYOUT_END);
    this._layoutMarks.forEach(layoutMark => {
      traverseMarkTree(
        layoutMark,
        'layoutChildren',
        (mark: IMark) => {
          mark.handleLayoutEnd();
        },
        // 顶层节点，不需要重新执行了
        (mark: IMark) => mark !== layoutMark
      );
    });
    this.emit(HOOK_EVENT.AFTER_MARK_LAYOUT_END);
  }

  private handleRenderEnd() {
    this.emit(HOOK_EVENT.BEFORE_MARK_RENDER_END);
    traverseMarkTree(this.rootMark, 'children', (mark: IMark) => {
      mark.handleRenderEnd();
    });
    this.emit(HOOK_EVENT.AFTER_MARK_RENDER_END);
  }

  // --- Dataflow ---

  commit(grammar: IGrammarBase) {
    this._dataflow.commit(grammar);
    return this;
  }

  run(runningConfig?: IRunningConfig) {
    this.evaluate(runningConfig);

    return this;
  }

  runSync(runningConfig?: IRunningConfig) {
    this.evaluateSync(runningConfig);

    return this;
  }

  isRunning() {
    return this._running;
  }

  async runAsync(runningConfig?: IRunningConfig) {
    if (this._isReleased) {
      return;
    }
    // await previously queued functions
    while (this._running) {
      await this._running;
      if (this._isReleased) {
        break;
      }
    }

    // run dataflow, manage running promise
    const clear = () => {
      this._running = null;
    };

    (this._running = this.evaluate(runningConfig)).then(clear, clear);

    return this._running;
  }

  async runNextTick(runningConfig?: IRunningConfig) {
    // delay the evaluate progress to next tick
    if (!this._currentDataflow) {
      this._currentDataflow = Promise.resolve().then(() => {
        return this.runAsync(runningConfig)
          .then(() => {
            this._currentDataflow = null;
          })
          .catch((e: any) => {
            this._currentDataflow = null;
            this.logger.error(e);
          });
      });
    }
    await this._currentDataflow;

    return this;
  }

  private doRender(immediately: boolean) {
    this.emit(HOOK_EVENT.BEFORE_DO_RENDER);
    // render as needed
    if (this.renderer) {
      if (!this._progressiveMarks) {
        this.animate.animate();
      }
      // 绘图 =>
      this.renderer.render(immediately);
      this.handleRenderEnd();
    }
    this.emit(HOOK_EVENT.AFTER_DO_RENDER);
  }

  private async evaluate(runningConfig?: IRunningConfig) {
    if (this._isReleased) {
      return;
    }
    const normalizedRunningConfig = normalizeRunningConfig(runningConfig);

    const grammarWillDetach = this._cachedGrammars.size() > 0;

    if (grammarWillDetach) {
      this.reuseCachedGrammars(normalizedRunningConfig);
      this.detachCachedGrammar();
    }
    // For most of time, width & height signal won't be modified duration dataflow,
    //  so resizing before generating vRender graphic items should be faster.
    const hasResize = this._resizeRenderer();
    const hasUpdate = this._dataflow.hasCommitted();

    // if no grammar is update and layout is unnecessary, end evaluating
    if (!grammarWillDetach && !hasUpdate && !this._layoutState && !hasResize) {
      return this;
    }

    this.clearProgressive();
    // stop auto render of vrender to avoid the case that vrender auto render before the asynchronous task is done
    this.renderer?.preventRender(true);

    // evaluate dataflow
    await this._dataflow.evaluate();

    if (this._isReleased) {
      return;
    }

    if (this._needBuildLayoutTree) {
      this.buildLayoutTree();
      this._needBuildLayoutTree = false;
    }

    if (this._layoutState) {
      this._layoutState = LayoutState.layouting;
      this.doLayout();

      if (this._dataflow.hasCommitted()) {
        this._layoutState = LayoutState.reevaluate;
        await this._dataflow.evaluate();

        if (this._isReleased) {
          return;
        }
      }

      this._layoutState = LayoutState.after;
      if (this._layoutMarks?.length) {
        this.handleLayoutEnd();
      }
    }
    // enable auto render of vrender after the asynchronous task is done
    this.renderer?.preventRender(false);
    this._layoutState = null;

    this.findProgressiveMarks();

    // resize again if width/height signal is updated duration dataflow
    this._resizeRenderer();
    this.doRender(false);

    this._willMorphMarks?.forEach(morphMarks => {
      this._morph.morph(morphMarks.prev, morphMarks.next, normalizedRunningConfig);
    });
    this._willMorphMarks = null;

    this.releaseCachedGrammars(normalizedRunningConfig);

    this.doPreProgressive();

    return this;
  }

  private evaluateSync(runningConfig?: IRunningConfig) {
    const normalizedRunningConfig = normalizeRunningConfig(runningConfig);

    const grammarWillDetach = this._cachedGrammars.size() > 0;

    if (grammarWillDetach) {
      this.reuseCachedGrammars(normalizedRunningConfig);
      this.detachCachedGrammar();
    }

    const hasResize = this._resizeRenderer();
    const hasUpdate = this._dataflow.hasCommitted();

    if (!grammarWillDetach && !hasUpdate && !this._layoutState && !hasResize) {
      return this;
    }

    this.clearProgressive();
    // evaluate dataflow
    this._dataflow.evaluateSync();

    if (this._needBuildLayoutTree) {
      this.buildLayoutTree();
      this._needBuildLayoutTree = false;
    }

    if (this._layoutState) {
      this._layoutState = LayoutState.layouting;
      this.doLayout();

      if (this._dataflow.hasCommitted()) {
        this._layoutState = LayoutState.reevaluate;
        this._dataflow.evaluateSync();
      }

      this._layoutState = LayoutState.after;
      if (this._layoutMarks?.length) {
        this.handleLayoutEnd();
      }
    }
    this._layoutState = null;

    this.findProgressiveMarks();

    this._resizeRenderer();
    this.doRender(true);

    this._willMorphMarks?.forEach(morphMarks => {
      this._morph.morph(morphMarks.prev, morphMarks.next, normalizedRunningConfig);
    });
    this._willMorphMarks = null;

    this.releaseCachedGrammars(normalizedRunningConfig);

    this.doPreProgressive();

    return this;
  }

  private reuseCachedGrammars(runningConfig: IRunningConfig) {
    if (!this._willMorphMarks) {
      this._willMorphMarks = [];
    }

    if (runningConfig.reuse) {
      const reuseDiffUpdate = (diff: { prev: IGrammarBase; next: IGrammarBase }) => {
        diff.next.reuse(diff.prev);
        diff.prev.detachAll();
        diff.prev.clear();
        this._cachedGrammars.unrecord(diff.prev);
      };

      const diffedSignal = this._morph.diffGrammar(
        this._cachedGrammars.getAllSignals(),
        this.grammars.getAllSignals().filter(signal => !BuiltInSignalID.includes(signal.id()))
      );
      diffedSignal.update.forEach(reuseDiffUpdate);

      const diffedData = this._morph.diffGrammar(this._cachedGrammars.getAllData(), this.grammars.getAllData());
      diffedData.update.forEach(reuseDiffUpdate);

      const diffedScale = this._morph.diffGrammar(this._cachedGrammars.getAllScales(), this.grammars.getAllScales());
      diffedScale.update.forEach(reuseDiffUpdate);

      const diffedCoordinate = this._morph.diffGrammar(
        this._cachedGrammars.getAllCoordinates(),
        this.grammars.getAllCoordinates()
      );
      diffedCoordinate.update.forEach(reuseDiffUpdate);

      // TODO: reuse custom
    }

    const diffedMark = this._morph.diffMark(
      this._cachedGrammars.getAllMarks(),
      this.grammars.getAllMarks().filter(mark => mark.id() !== 'root'),
      runningConfig
    );
    diffedMark.update.forEach(diff => {
      const matched =
        diff.prev.length === 1 && diff.next.length === 1 && diff.prev[0].markType === diff.next[0].markType;
      const enableMarkMorphConfig =
        diff.prev.every(mark => mark.getMorphConfig().morph) && diff.next.every(mark => mark.getMorphConfig().morph);
      if (matched && runningConfig.reuse) {
        diff.next[0].reuse(diff.prev[0]);
        diff.prev[0].detachAll();
        diff.prev[0].clear();
        this._cachedGrammars.unrecord(diff.prev[0]);
      } else if ((runningConfig.morph && enableMarkMorphConfig) || runningConfig.morphAll) {
        this._willMorphMarks.push({ prev: diff.prev, next: diff.next });
      }
    });
  }

  private detachCachedGrammar() {
    this._cachedGrammars.traverse(grammar => {
      grammar.detachAll();
      if (grammar.grammarType === 'mark') {
        const mark = grammar as IMark;
        mark.group?.removeChild?.(mark);
      }
    });
  }

  private releaseCachedGrammars(runningConfig?: IRunningConfig) {
    // directly release all grammars except from marks
    this._cachedGrammars.traverse(grammar => {
      if (grammar.grammarType !== 'mark') {
        grammar.release();
      }
    });
    const markNodes = this._cachedGrammars.getAllMarkNodes();
    markNodes.forEach(node => {
      node.mark.animate.stop();
      if (runningConfig.enableExitAnimation) {
        this.animate.animateAddition(node.mark);
      }
    });
    const releaseUp = (node: IMarkTreeNode) => {
      // do nothing when mark is already released or is still animating
      if (!node.mark.view || node.mark.animate.getAnimatorCount() !== 0) {
        return;
      }
      // release when current node is leaf node
      if (!node.children || node.children.length === 0) {
        node.mark.release();
        // detach current node from tree and traverse above
        const parent = node.parent;
        if (parent) {
          node.parent.children = node.parent.children.filter(n => n !== node);
          node.parent = null;
          releaseUp(parent);
        }
      }
    };
    markNodes.forEach(node => {
      const mark = node.mark;
      if (mark.animate.getAnimatorCount() === 0) {
        releaseUp(node);
      } else {
        mark.addEventListener('animationEnd', () => {
          if (mark.animate.getAnimatorCount() === 0) {
            releaseUp(node);
          }
        });
      }
    });
    this._cachedGrammars.clear();
  }

  runAfter(callback: (view: IView) => void) {
    this._dataflow.runAfter(() => {
      callback.call(null, this);
    });
    return this;
  }

  runBefore(callback: (view: IView) => void) {
    this._dataflow.runBefore(() => {
      callback.call(null, this);
    });
    return this;
  }

  /**
   * 目前仅支持 node 环境，用于 node 端的图片导出
   * @returns
   */
  getImageBuffer() {
    if (this._options.mode !== 'node') {
      this.logger.error(new TypeError('getImageBuffer() now only support node environment.'));
      return;
    }
    const stage = this.renderer?.stage?.();
    if (stage) {
      stage.render();
      const buffer = stage.window.getImageBuffer();
      return buffer;
    }
    this.logger.error(new ReferenceError(`render is not defined`));

    return null;
  }

  // --- Mark Tree ---

  traverseMarkTree(apply: (mark: IMark) => any, filter?: (mark: IMark) => boolean, leafFirst?: boolean) {
    traverseMarkTree(this.rootMark, 'children', apply, filter, leafFirst);
    return this;
  }

  // --- Resize ---

  private _bindResizeEvent() {
    if (this.autoFit()) {
      const container = this.renderer?.stage?.()?.window?.getContainer?.();
      if (container) {
        const ResizeObserverWindow: any = window.ResizeObserver;
        this._observer = new ResizeObserverWindow(this._onResize);
        this._observer?.observe(container);
      }
      window.addEventListener('resize', this._onResize);
    }
  }

  private _unBindResizeEvent() {
    if (this.autoFit()) {
      window.removeEventListener('resize', this._onResize);
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
    }
  }

  private _getContainerSize() {
    const container = this.renderer?.stage?.()?.window?.getContainer?.();

    if (container) {
      const { width: containerWidth, height: containerHeight } = getContainerSize(container!);
      const width = this._spec?.width ?? this._options.width ?? containerWidth;
      const height = this._spec?.height ?? this._options.height ?? containerHeight;

      return { width, height };
    }

    return null;
  }

  private _onResize = debounce((...args: any[]) => {
    const size = this._getContainerSize();

    if (size) {
      this.resize(size.width, size.height);
    }
  }, 100);

  async resize(width: number, height: number, render: boolean = true) {
    let needDataflow = false;

    // width value changed: update signal, skip resize op
    if (width !== this.width()) {
      needDataflow = true;
      this.updateSignal(SIGNAL_WIDTH, width);
    }

    // height value changed: update signal, skip resize op
    if (height !== this.height()) {
      needDataflow = true;
      this.updateSignal(SIGNAL_HEIGHT, height);
    }

    // run dataflow on width/height signal change
    if (needDataflow) {
      if (render) {
        await this.evaluate();
      } else {
        await this._dataflow.evaluate();
      }
    }

    return this;
  }

  private _resizeRenderer() {
    const width = this.width();
    const height = this.height();

    if (this.renderer.shouldResize(width, height)) {
      this.renderer.resize(width, height);
      this.emit('resize', {}, { width, height });
      return true;
    }

    return false;
  }

  // --- Event ---

  private bindEvents(eventSpec: BaseEventSpec) {
    if (this._eventConfig.disable) {
      return;
    }
    const { type: evtType, filter, callback, throttle, debounce, consume, target, dependency } = eventSpec;
    const eventSelector = parseEventSelector(evtType);

    if (!eventSelector) {
      return;
    }
    const { source, type } = eventSelector;

    const markFilter = generateFilterByMark(eventSelector);
    const targetSignals =
      Array.isArray(target) && target.length
        ? target.map(entry => {
            return {
              signal: this.getSignalById(entry.target),
              callback: entry.callback
            };
          })
        : [
            {
              signal: isString(target) ? this.getSignalById(target) : null,
              callback
            }
          ];
    const validateSignals = targetSignals.filter(entry => entry.signal || entry.callback);
    const refs = parseReference(dependency, this);

    const send = parseHandler(
      (evt?: any, element?: IElement) => {
        const needPreventDefault =
          (source === EVENT_SOURCE_VIEW && prevent(this._eventConfig, type)) ||
          (consume && (evt.cancelable === undefined || evt.cancelable));

        if (source === EVENT_SOURCE_WINDOW) {
          evt = getExtendedEvents(this, evt, element, type, EVENT_SOURCE_WINDOW);
        }

        let hasCommitted = false;

        if ((!filter || filter(evt)) && (!markFilter || markFilter(element)) && validateSignals.length) {
          const params = refs.reduce((params, ref) => {
            params[ref.id()] = ref.output();
            return params;
          }, {});
          validateSignals.forEach(entry => {
            if (entry.callback && entry.signal) {
              const changed = entry.signal.set(entry.callback(evt, params));

              if (changed) {
                this.commit(entry.signal);
                hasCommitted = true;
              }
            } else if (entry.callback) {
              entry.callback(evt, params);
            } else {
              this.commit(entry.signal);
              hasCommitted = true;
            }
          });
        }

        if (needPreventDefault) {
          evt.preventDefault();
        }

        if (consume) {
          evt.stopPropagation();
        }

        if (hasCommitted) {
          this.runAsync();
        }
      },
      { throttle, debounce }
    );

    if (source === EVENT_SOURCE_VIEW) {
      if (permit(this._eventConfig, EVENT_SOURCE_VIEW, type)) {
        // send traps errors, so use {trap: false} option
        this.addEventListener(type, send, NO_TRAP);

        return () => {
          this.removeEventListener(type, send);
        };
      }
    } else if (source === EVENT_SOURCE_WINDOW) {
      vglobal.addEventListener(type, send);
      this._eventListeners.push({
        type: type,
        source: vglobal,
        handler: send
      });

      return () => {
        vglobal.removeEventListener(type, send);

        const index = this._eventListeners.findIndex((entry: any) => {
          return entry.type === type && entry.source === vglobal && entry.handler === send;
        });

        if (index >= 0) {
          this._eventListeners.splice(index, 1);
        }
      };
    }
  }

  event(eventSpec: EventSpec) {
    if ('between' in eventSpec) {
      const [starEvent, endEvent] = eventSpec.between;
      // FIXME between需要生成唯一ID
      const id = `${starEvent.type}-${eventSpec.type}-${endEvent.type}`;

      let unbindEndEvent: any;

      this.bindEvents(
        Object.assign({}, starEvent, {
          callback: () => {
            if (!this._eventCache) {
              this._eventCache = {};
            }
            // 中间的事件绑定
            if (!this._eventCache[id]) {
              const unbindEvent = this.bindEvents(eventSpec);
              this._eventCache[id] = unbindEvent;
            }
            if (!unbindEndEvent) {
              // 结束的事件绑定
              unbindEndEvent = this.bindEvents(
                Object.assign({}, endEvent, {
                  callback: () => {
                    if (this._eventCache[id]) {
                      this._eventCache[id]();
                      this._eventCache[id] = null;
                    }
                  }
                })
              );
            }
          }
        })
      );
    } else if ('merge' in eventSpec) {
      eventSpec.merge.forEach(entry => {
        const singleEvent: Partial<BaseEventSpec> = Object.assign({}, eventSpec);

        if (isString(entry)) {
          singleEvent.type = entry;
        } else if (isObject(entry)) {
          Object.assign(singleEvent, entry);
        }
        singleEvent.debounce = 50;
        this.bindEvents(singleEvent as BaseEventSpec);
      });
    } else {
      this.bindEvents(eventSpec);
    }
  }

  interaction(type: string, spec: Partial<InteractionSpec>) {
    const interaction = Factory.createInteraction(type, this, spec);

    if (interaction) {
      interaction.bind();

      if (!this._boundInteractions) {
        this._boundInteractions = [];
      }

      this._boundInteractions.push(interaction);
    }
    return interaction;
  }

  removeInteraction(type: string | IInteraction) {
    if (this._boundInteractions) {
      const instances = this._boundInteractions.filter(
        interaction => (isString(type) && interaction.type === type) || interaction === type
      );

      if (instances.length) {
        instances.forEach(instance => {
          instance.unbind();
        });
      }
    }

    return this;
  }

  removeAllInteractions() {
    if (this._boundInteractions) {
      this._boundInteractions.forEach(instance => {
        instance.unbind();
      });

      this._boundInteractions = null;
    }

    return this;
  }

  private initEvent() {
    // 基于 vRender 事件系统提供的委托机制
    const stage = this.renderer.stage();
    stage && stage.on('*', this.delegateEvent);
  }

  private delegateEvent = (event: any, type: string) => {
    const activeElement = event.target?.[BridgeElementKey];
    const extendedEvt = getExtendedEvents(this, event, activeElement, type, EVENT_SOURCE_VIEW);
    this.emit(type, extendedEvt, activeElement);
  };

  addEventListener(type: string, handler: BaseEventHandler, options?: any) {
    let callback = handler;
    if (!(options && options.trap === false)) {
      callback = handler;
      (callback as any).raw = handler;
    }
    if (options && options.target) {
      (callback as any).target = options.target;
    }
    this.on(type, callback);
    return this;
  }

  removeEventListener(type: string, handler?: BaseEventHandler) {
    if (handler) {
      this.off(type, handler);
    } else {
      this.off(type);
    }
    return this;
  }

  // --- Initialization ---

  private initializeRenderer() {
    const width = this._options.width;
    const height = this._options.height;

    this.renderer = new CanvasRenderer(this);
    this.renderer.initialize(width, height, this._options, this._eventConfig).background(this._background);
  }

  private initialize() {
    this.grammars = new RecordedGrammars(
      grammar => grammar.id(),
      (key, grammar) => this.logger.warn(`Grammar id '${key}' has been occupied`, grammar)
    );
    this._cachedGrammars = new RecordedTreeGrammars(grammar => grammar.id());

    if (this._options.logger) {
      Logger.setInstance(this._options.logger);
    }
    this.logger = Logger.getInstance(this._options.logLevel ?? 0);

    this._dataflow = new Dataflow();

    this.animate = new ViewAnimate(this);

    this._morph = new Morph();

    // 执行钩子
    if (this._options.hooks) {
      Object.keys(this._options.hooks).forEach(key => {
        this.on(key, this._options.hooks[key]);
      });
      // 生命周期事件（包含原性能测试钩子）
      this.hooks = this._options.hooks;
    }
    this.container = null;

    // initialize renderer, handler and event management
    this.renderer = null;
    this._eventListeners = [];

    // initialize event configuration
    this._eventConfig = initializeEventConfig(this._options.eventConfig);

    // set default theme
    this._theme = this._options.disableTheme ? null : ThemeManager.getDefaultTheme();

    this.parseBuiltIn();

    // initialize DOM container(s) and renderer
    configureEnvironment(this._options);
    this.initializeRenderer();

    if (!this._eventConfig.disable) {
      this.initEvent();
    }
    this._bindResizeEvent();

    this._currentDataflow = null;
    // update layout tree after initialization
    this._needBuildLayoutTree = true;
    this._layoutState = LayoutState.before;

    // apply theme value after initialization
    this.theme(this._theme);
  }

  // --- Others ---

  pauseProgressive() {
    return false;
  }
  resumeProgressive() {
    return false;
  }
  restartProgressive() {
    return false;
  }

  private findProgressiveMarks() {
    const marks: IMark[] = [];

    this.traverseMarkTree(
      (mark: IMark) => {
        marks.push(mark);
      },
      (mark: IMark) => mark.markType !== GrammarMarkType.group && mark.isProgressive()
    );

    if (!marks.length) {
      this._progressiveMarks = null;
      return null;
    }

    this._progressiveMarks = marks;

    if (this.renderer) {
      this.renderer.combineIncrementalLayers();
    }

    return marks;
  }

  private doPreProgressive() {
    if (this._progressiveMarks && this._progressiveMarks.some(mark => mark.isDoingProgressive())) {
      const raf = vglobal.getRequestAnimationFrame();
      this._progressiveRafId = raf(this.handleProgressiveFrame);
    }
  }

  /** 监听frame事件，更新增量元素的mark */
  private handleProgressiveFrame = () => {
    if (this._progressiveMarks.length) {
      this._progressiveMarks.forEach(mark => {
        if (mark.isDoingProgressive()) {
          mark.evaluateProgressive();
        }
      });
    }

    this.doPreProgressive();
  };

  /** 清除 */
  private clearProgressive() {
    if (this._progressiveRafId) {
      const cancelRaf = vglobal.getCancelAnimationFrame();
      cancelRaf(this._progressiveRafId);
    }

    if (this._progressiveMarks && this._progressiveMarks.length) {
      this._progressiveMarks.forEach(entry => {
        entry.clearProgressive();
      });

      this._progressiveMarks = null;
    }
  }

  // --- release ---
  release() {
    this._isReleased = true;
    this._unBindResizeEvent();
    this.clearProgressive();
    Factory.unregisterRuntimeTransforms();

    this.animate.stop();

    this.grammars.release();
    this._cachedGrammars.release();

    this._dataflow.release();
    this._dataflow = null;

    this.renderer?.release?.();
    this.renderer = null;
    this._boundInteractions = null;

    // 卸载事件
    this.removeAllListeners();
    this._eventListeners?.forEach((listener: any) => {
      listener.source.removeEventListener(listener.type, listener.handler);
    });
    this._eventListeners = null;
  }
}
