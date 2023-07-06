import { EventEmitter, debounce, isNil, isObject, isString, getContainerSize } from '@visactor/vutils';
import type { IColor } from '@visactor/vrender';
// eslint-disable-next-line no-duplicate-imports
import { global } from '@visactor/vrender';
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
  IBaseAnimate,
  IRecordedGrammars,
  IComponent,
  ComponentSpec
} from '../types/';
import type { ILogger } from '@visactor/vgrammar-util';
// eslint-disable-next-line no-duplicate-imports
import { setLogger, getLogger } from '@visactor/vgrammar-util';
import { unregisterRuntimeTransforms } from '../transforms/register';
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
  CURSOR_DEFAULT,
  DEFAULT_HOVER_STATE,
  SIGNAL_VIEW_WIDTH,
  SIGNAL_VIEW_HEIGHT,
  DEFAULT_PADDING,
  EVENT_SOURCE_VIEW,
  EVENT_SOURCE_WINDOW
} from './constants';
import { Signal } from './signal';
import { Scale } from './scale';
import {
  BuiltInSignalID,
  builtInSignals,
  normalizeMarkTree,
  normalizeMorphConfig,
  normalizePadding
} from '../parse/view';
import { parseHandler, parseEventSelector, generateFilterByMark } from '../parse/event';
import { parseReference } from '../parse/util';
import { getCustomizedGrammars, getGrammar } from './register-grammar';
import { configureEnvironment } from '../graph/util/env';
import { GroupMark } from './group';
import { Mark } from './mark';
import { defaultDoLayout } from '../graph/layout/layout';
import { GlyphMark } from './glyph';
import { Coordinate } from './coordinate';
import type { IMorph, IMorphConfig } from '../types/morph';
import { Morph } from '../graph/animation/morph';
import { RecordedGrammars } from './grammar-record';
import { ViewAnimate } from './animate';
import type { IRenderer } from '../types/renderer';
import { ComponentEnum, HOOK_EVENT, LayoutState, GrammarMarkType } from '../graph/enums';
import { createComponent } from '../component';
import type { IAxis, ICrosshair, IDatazoom, ILabel, ILegend, IPlayer, ISlider, ITooltip } from '../types/component';
import { Interval } from '../grammar-marks/interval';
import { Cell } from '../grammar-marks/cell';

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
  animate: IBaseAnimate;
  /** 增加参数 指定当前的 evaluate 是否是不进行绘制的 */
  private _runIgnoreRender: boolean;
  rootMark: IGroupMark;

  /** 生命周期相关的钩子 */
  hooks: Hooks;

  logger: ILogger;

  grammars: IRecordedGrammars;

  private _spec: ViewSpec;
  private _config: IViewThemeConfig;
  private _options: IViewOptions;

  private _cachedGrammars: IRecordedGrammars;
  private _willMorphMarks: { prev: IMark[]; next: IMark[] }[];

  /** morph animate */
  private _morph: IMorph;

  private _eventConfig: IViewEventConfig;
  /** 全局鼠标样式 */
  private _globalCursor: boolean | string;
  private _eventListeners: Array<{
    type: string;
    source: any;
    handler: any;
  }>;

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
  private _cursorValue?: { user: string; element: IElement };
  private _observer: ResizeObserver = null;

  constructor(options: IViewOptions = {}, config: IViewThemeConfig = {}) {
    super();
    this._config = config;
    this._options = Object.assign(
      {
        mode: BROWSER,
        padding: DEFAULT_PADDING,
        cursor: true
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
    const scale: IScale = new Scale(this, type);
    this.grammars.record(scale);
    this._dataflow.add(scale);
    return scale;
  }

  coordinate(type: CoordinateType) {
    const coordinate: ICoordinate = new Coordinate(this, type);
    this.grammars.record(coordinate);
    this._dataflow.add(coordinate);
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
        mark = createComponent(this, markOptions?.componentType, groupMark, markOptions?.mode);
        break;
      case GrammarMarkType.interval:
        mark = new Interval(this, type, groupMark);
        break;
      case GrammarMarkType.cell:
        mark = new Cell(this, type, groupMark);
        break;
      default:
        mark = new Mark(this, type, groupMark);
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

  legend(group: IGroupMark | string) {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.legend }) as ILegend;
  }

  crosshair(group: IGroupMark | string) {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.crosshair }) as ICrosshair;
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

  tooltip(group: IGroupMark | string) {
    return this.mark(GrammarMarkType.component, group, { componentType: ComponentEnum.tooltip }) as ITooltip;
  }

  customized(type: string, spec: any) {
    const res = getGrammar(type);

    if (res) {
      const grammar = new res.grammarClass(this);
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
    return this;
  }

  removeGrammar(grammar: string | IGrammarBase) {
    const recordedGrammar = isString(grammar) ? this.getGrammarById(grammar) : grammar;
    if (!recordedGrammar || !this.grammars.find(storedGrammar => storedGrammar.uid === recordedGrammar.uid)) {
      return this;
    }
    this._cachedGrammars.record(recordedGrammar);
    this._dataflow.remove(recordedGrammar);
    // clear grammar after next running
    // recordedGrammar.clear();
    this.grammars.unrecord(recordedGrammar);
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

  // --- Handle Spec ---

  parseSpec(spec: ViewSpec) {
    this.emit(HOOK_EVENT.BEFORE_PARSE_VIEW);
    this._spec = spec;
    normalizeMarkTree(spec);

    this.parseGlobalSpec(spec);

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
        this.coordinate(coordinate.type).parse(coordinate);
      });
    }

    if (spec.scales?.length) {
      spec.scales.forEach(scale => {
        this.scale(scale.type).parse(scale);
      });
    }

    const customizedGrammars = getCustomizedGrammars();

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

    this.emit(HOOK_EVENT.AFTER_PARSE_VIEW);

    // 更新spec后，需要更新布局树
    this._needBuildLayoutTree = true;
    this._layoutState = LayoutState.before;

    return this;
  }

  updateSpec(spec: ViewSpec) {
    this.removeAllGrammars();
    return this.parseSpec(spec);
  }

  private parseBuiltIn() {
    // 创建内置的 Signal
    builtInSignals(this._options, this._config).map(signalSpec => {
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

  private parseGlobalSpec(spec: ViewSpec) {
    if (spec.background) {
      this._background = spec.background;
      this.renderer.background(this._background);
    }

    if (spec.width) {
      this.width(spec.width);
    }

    if (spec.height) {
      this.height(spec.height);
    }

    if (spec.padding) {
      this.padding(spec.padding);
    }
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

  run(morphConfig?: IMorphConfig) {
    this.evaluate(morphConfig);

    return this;
  }

  runSync(morphConfig?: IMorphConfig) {
    this.evaluateSync(morphConfig);

    return this;
  }

  isRunning() {
    return this._running;
  }

  async runAsync(morphConfig?: IMorphConfig) {
    // await previously queued functions
    while (this._running) {
      await this._running;
    }

    // run dataflow, manage running promise
    const clear = () => {
      this._running = null;
    };

    (this._running = this.evaluate(morphConfig)).then(clear, clear);

    return this._running;
  }

  async runNextTick(morphConfig?: IMorphConfig) {
    // delay the evaluate progress to next tick
    if (!this._currentDataflow) {
      this._currentDataflow = Promise.resolve().then(() => {
        return this.runAsync(morphConfig)
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

  ignoreRender(ignore: boolean) {
    this._runIgnoreRender = ignore;
    return this;
  }

  private doRender(immediately: boolean) {
    this.emit(HOOK_EVENT.BEFORE_DO_RENDER);
    // render as needed
    if (!this._runIgnoreRender && this.renderer) {
      if (!this._progressiveMarks) {
        this.animate.animate();
      }
      // 绘图 =>
      this.renderer.render(immediately);
      this.handleRenderEnd();
    }
    this.emit(HOOK_EVENT.AFTER_DO_RENDER);
  }

  private async evaluate(morphConfig?: IMorphConfig) {
    const normalizedMorphConfig = normalizeMorphConfig(morphConfig);

    this.reuseCachedGrammars(normalizedMorphConfig);
    const grammarWillDetach = this._cachedGrammars.size() > 0;
    this.detachCachedGrammar();
    // For most of time, width & height signal won't be modified duration dataflow,
    //  so resizing before generating vRender graphic items should be faster.
    const hasResize = this._resizeRenderer();
    const hasUpdate = this._dataflow.hasCommitted();

    // if no grammar is update and layout is unnecessary, end evaluating
    if (!grammarWillDetach && !hasUpdate && !this._layoutState && !hasResize) {
      return this;
    }

    this.clearProgressive();

    // evaluate dataflow
    await this._dataflow.evaluate();

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
      }

      this._layoutState = LayoutState.after;
      if (this._layoutMarks?.length) {
        this.handleLayoutEnd();
      }
    }
    this._layoutState = null;

    this.findProgressiveMarks();

    // resize again if width/height signal is updated duration dataflow
    this._resizeRenderer();
    this.doRender(false);

    this._willMorphMarks?.forEach(morphMarks => {
      this._morph.morph(morphMarks.prev, morphMarks.next, normalizedMorphConfig);
    });
    this._willMorphMarks = null;

    this.releaseCachedGrammars();

    this.doPreProgressive();

    return this;
  }

  private evaluateSync(morphConfig?: IMorphConfig) {
    const normalizedMorphConfig = normalizeMorphConfig(morphConfig);

    this.reuseCachedGrammars(normalizedMorphConfig);
    const grammarWillDetach = this._cachedGrammars.size() > 0;
    this.releaseCachedGrammars();
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
      this._morph.morph(morphMarks.prev, morphMarks.next, normalizedMorphConfig);
    });
    this._willMorphMarks = null;

    this.releaseCachedGrammars();

    this.doPreProgressive();

    return this;
  }

  private reuseCachedGrammars(morphConfig: IMorphConfig) {
    if (!this._willMorphMarks) {
      this._willMorphMarks = [];
    }

    if (morphConfig.reuse) {
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
      morphConfig
    );
    diffedMark.update.forEach(diff => {
      const matched =
        diff.prev.length === 1 && diff.next.length === 1 && diff.prev[0].markType === diff.next[0].markType;
      if (matched && morphConfig.reuse) {
        diff.next[0].reuse(diff.prev[0]);
        diff.prev[0].detachAll();
        diff.prev[0].clear();
        this._cachedGrammars.unrecord(diff.prev[0]);
      } else if (morphConfig.morph) {
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

  private releaseCachedGrammars() {
    this._cachedGrammars.traverse(grammar => {
      if (grammar.grammarType === 'mark') {
        const mark = grammar as IMark;
        mark.prepareRelease();
        mark.animate.animate();
        if (mark.animate.getAnimatorCount() === 0) {
          mark.release();
        } else {
          mark.addEventListener('animationEnd', event => {
            if (mark.animate.getAnimatorCount() === 0) {
              mark.release();
            }
          });
        }
      } else {
        grammar.release();
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

    // this.renderer.background(this._background);
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
      global.addEventListener(type, send);
      this._eventListeners.push({
        type: type,
        source: global,
        handler: send
      });

      return () => {
        global.removeEventListener(type, send);

        const index = this._eventListeners.findIndex((entry: any) => {
          return entry.type === type && entry.source === global && entry.handler === send;
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

  private hover(hoverState?: string) {
    const state = hoverState || DEFAULT_HOVER_STATE;
    // evaluate cursor on each mousemove event

    this.addEventListener('pointerover', (evt: any) => {
      if (!evt.element) {
        return;
      }
      const element: IElement = evt.element;
      element.addState(state);
    });

    this.addEventListener('pointerout', (evt: any) => {
      if (!evt.element) {
        return;
      }
      const element: IElement = evt.element;
      element.removeState(state);
    });

    return this;
  }

  cursor() {
    this._cursorValue = {
      user: CURSOR_DEFAULT,
      element: null
    };
    this.addEventListener('mousemove', (evt: any) => {
      const elementCursor = evt?.element?.graphicItem?.cursor;
      const value = this._cursorValue;
      const user = value ? (isString(value) ? value : value.user) : CURSOR_DEFAULT;

      const nextValue =
        value &&
        user === value.user &&
        (elementCursor === value.element || (isNil(elementCursor) && isNil(value.element)))
          ? value
          : { user: user, element: elementCursor };

      if (nextValue !== value) {
        this._cursorValue = nextValue;

        this.setCursor(
          nextValue.user && nextValue.user !== CURSOR_DEFAULT ? nextValue.user : nextValue.element ?? nextValue.user
        );
      }
    });
  }

  private initEvent() {
    // 基于 vRender 事件系统提供的委托机制
    const stage = this.renderer.stage();
    stage.on('*', this.delegateEvent);
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

  private setCursor(cursor?: string) {
    if (this._options.domBridge && this._options.domBridge.setCursor) {
      this._options.domBridge.setCursor(cursor);
      return;
    }
    const el = this.globalCursor() ? !isNil(document) && document.body : this.container;

    if (el) {
      return isNil(cursor)
        ? (el as HTMLElement).style.removeProperty('cursor')
        : ((el as HTMLElement).style.cursor = cursor);
    }
  }

  globalCursor(_?: boolean) {
    if (arguments.length) {
      if (this._globalCursor !== !!_) {
        const prev = this.setCursor(null); // clear previous cursor
        this._globalCursor = !!_;
        if (prev) {
          this.setCursor(prev);
        } // swap cursor
      }
      return this;
    }
    return this._globalCursor;
  }

  // --- Initialization ---

  private initializeRenderer() {
    const width = this._options.width;
    const height = this._options.height;

    this.renderer = new CanvasRenderer(this);
    this.renderer.initialize(width, height, this._options, this._eventConfig).background(this._background);
  }

  private initializeBuiltEvents() {
    // register cursor events
    if (this._options.cursor) {
      this.cursor();
    }

    // register hover events
    if (this._options.hover) {
      this.hover();
    }

    this._bindResizeEvent();
  }

  private initialize() {
    this.grammars = new RecordedGrammars(
      grammar => grammar.id(),
      (key, grammar) => this.logger.warn(`Grammar id '${key}' has been occupied`, grammar)
    );
    this._cachedGrammars = new RecordedGrammars(grammar => grammar.id());

    if (this._options.logger) {
      setLogger(this._options.logger);
    }

    this.logger = getLogger(this._options.logLevel ?? 0);

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

    this._runIgnoreRender = false;
    this.container = null;

    // initialize renderer, handler and event management
    this.renderer = null;
    this._globalCursor = false;
    this._eventListeners = [];

    // initialize event configuration
    this._eventConfig = initializeEventConfig(this._options.eventConfig);
    // If false (default), the cursor is set for the Vega View element only.
    // If true, the cursor is set globally for the entire document body.
    this.globalCursor(this._eventConfig.globalCursor);

    // initialize background color
    this._background = this._options.background;

    this.parseBuiltIn();

    // initialize DOM container(s) and renderer
    configureEnvironment(this._options);
    this.initializeRenderer();

    if (!this._eventConfig.disable) {
      this.initEvent();
    }
    this.initializeBuiltEvents();

    this._currentDataflow = null;
    this._needBuildLayoutTree = true;
    this._layoutState = LayoutState.before;
  }

  // --- Others ---

  normalBrowserEnv() {
    return this._options.mode === 'browser';
  }

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
      const raf = global.getRequestAnimationFrame();
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
      const cancelRaf = global.getCancelAnimationFrame();
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
    this._unBindResizeEvent();
    this.clearProgressive();
    unregisterRuntimeTransforms();

    this.animate.stop();

    this.grammars.release();
    this._cachedGrammars.release();

    this._dataflow = null;

    this.renderer?.release?.();
    this.renderer = null;

    // 卸载事件
    this.removeAllListeners();
    this._eventListeners?.forEach((listener: any) => {
      listener.source.removeEventListener(listener.type, listener.handler);
    });
    this._eventListeners = null;
  }
}
