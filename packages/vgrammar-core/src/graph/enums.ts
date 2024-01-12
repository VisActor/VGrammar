/**
 * @file
 * Don't import any type, this may lead to CIRCULAR_DEPENDENCY
 */

export enum BuiltInEncodeNames {
  enter = 'enter',
  update = 'update',
  exit = 'exit',
  group = 'group',
  connectNulls = 'connectNulls'
}

/**
 * state of diff
 */
export enum DiffState {
  enter = 'enter',
  update = 'update',
  exit = 'exit',
  unChange = 'unChange'
}
/**
 * mark类型
 */
export enum GrammarMarkType {
  // basic mark
  arc = 'arc',
  arc3d = 'arc3d',
  area = 'area',
  image = 'image',
  line = 'line',
  path = 'path',
  rect = 'rect',
  rect3d = 'rect3d',
  rule = 'rule',
  shape = 'shape',
  symbol = 'symbol',
  text = 'text',
  richtext = 'richtext',
  polygon = 'polygon',
  pyramid3d = 'pyramid3d',
  circle = 'circle',

  // grammer mark
  cell = 'cell',
  interval = 'interval',

  // group mark
  group = 'group',

  // glyph mark
  glyph = 'glyph',

  // component mark
  component = 'component',

  // large mark
  largeRects = 'largeRects',
  largeSymbols = 'largeSymbols'
}

/**
 * built-in component type
 */
export enum ComponentEnum {
  axis = 'axis',
  grid = 'grid',
  legend = 'legend',
  slider = 'slider',
  label = 'label',
  datazoom = 'datazoom',
  player = 'player',
  title = 'title',
  scrollbar = 'scrollbar'
}

export enum DataFilterRank {
  player = 1,
  rollUp = 2,
  drillDown = 3,
  slider = 4,
  datazoom = 5,
  legend = 6,
  scrollbar = 7,
  brush = 8,
  normal = 9
}

export enum AxisEnum {
  lineAxis = 'lineAxis',
  circleAxis = 'circleAxis'
}

export enum GridEnum {
  lineAxisGrid = 'lineAxisGrid',
  circleAxisGrid = 'circleAxisGrid'
}

export enum LegendEnum {
  discreteLegend = 'discreteLegend',
  colorLegend = 'colorLegend',
  sizeLegend = 'sizeLegend'
}

export enum CrosshairEnum {
  lineCrosshair = 'lineCrosshair',
  rectCrosshair = 'rectCrosshair',
  sectorCrosshair = 'sectorCrosshair',
  circleCrosshair = 'circleCrosshair',
  polygonCrosshair = 'polygonCrosshair',
  ringCrosshair = 'ringCrosshair'
}

export enum LabelEnum {
  symbolLabel = 'symbolLabel',
  rectLabel = 'rectLabel',
  lineLabel = 'lineLabel',
  dataLabel = 'dataLabel'
}

export enum PlayerEnum {
  continuousPlayer = 'continuousPlayer',
  discretePlayer = 'discretePlayer'
}

/** 布局阶段 */
export enum LayoutState {
  before = 'before',
  layouting = 'layouting',
  reevaluate = 'reevaluate',
  after = 'after'
}

export enum HOOK_EVENT {
  BEFORE_EVALUATE_DATA = 'beforeEvaluateData',
  AFTER_EVALUATE_DATA = 'afterEvaluateData',

  BEFORE_EVALUATE_SCALE = 'beforeEvaluateScale',
  AFTER_EVALUATE_SCALE = 'afterEvaluateScale',

  BEFORE_PARSE_VIEW = 'beforeParseView',
  AFTER_PARSE_VIEW = 'afterParseView',

  BEFORE_TRANSFORM = 'beforeTransform',
  AFTER_TRANSFORM = 'afterTransform',

  BEFORE_CREATE_VRENDER_STAGE = 'beforeCreateVRenderStage',
  AFTER_CREATE_VRENDER_STAGE = 'afterCreateVRenderStage',

  BEFORE_CREATE_VRENDER_LAYER = 'beforeCreateVRenderLayer',
  AFTER_CREATE_VRENDER_LAYER = 'afterCreateVRenderLayer',

  BEFORE_STAGE_RESIZE = 'beforeStageResize',
  AFTER_STAGE_RESIZE = 'afterStageResize',

  BEFORE_VRENDER_DRAW = 'beforeVRenderDraw',
  AFTER_VRENDER_DRAW = 'afterVRenderDraw',

  BEFORE_MARK_JOIN = 'beforeMarkJoin',
  AFTER_MARK_JOIN = 'afterMarkJoin',
  BEFORE_MARK_UPDATE = 'beforeMarkUpdate',
  AFTER_MARK_UPDATE = 'afterMarkUpdate',
  BEFORE_MARK_STATE = 'beforeMarkState',
  AFTER_MARK_STATE = 'afterMarkState',
  BEFORE_MARK_ENCODE = 'beforeMarkEncode',
  AFTER_MARK_ENCODE = 'afterMarkEncode',

  BEFORE_DO_LAYOUT = 'beforeDoLayout',
  AFTER_DO_LAYOUT = 'afterDoLayout',

  BEFORE_MARK_LAYOUT_END = 'beforeMarkLayoutEnd',
  AFTER_MARK_LAYOUT_END = 'afterMarkLayoutEnd',

  BEFORE_DO_RENDER = 'beforeDoRender',
  AFTER_DO_RENDER = 'afterDoRender',

  BEFORE_MARK_RENDER_END = 'beforeMarkRenderEnd',
  AFTER_MARK_RENDER_END = 'afterMarkRenderEnd',

  BEFORE_CREATE_VRENDER_MARK = 'beforeCreateVRenderMark',
  AFTER_CREATE_VRENDER_MARK = 'afterCreateVRenderMark',

  BEFORE_ADD_VRENDER_MARK = 'beforeAddVRenderMark',
  AFTER_ADD_VRENDER_MARK = 'afterAddVRenderMark',

  AFTER_VRENDER_NEXT_RENDER = 'afterVRenderNextRender',

  BEFORE_ELEMENT_UPDATE_DATA = 'beforeElementUpdateData',
  AFTER_ELEMENT_UPDATE_DATA = 'afterElementUpdateData',

  BEFORE_ELEMENT_STATE = 'beforeElementState',
  AFTER_ELEMENT_STATE = 'afterElementState',

  BEFORE_ELEMENT_ENCODE = 'beforeElementEncode',
  AFTER_ELEMENT_ENCODE = 'afterElementEncode',

  ANIMATION_START = 'animationStart',
  ANIMATION_END = 'animationEnd',

  ELEMENT_ANIMATION_START = 'elementAnimationStart',
  ELEMENT_ANIMATION_END = 'elementAnimationEnd',

  ALL_ANIMATION_START = 'allAnimationStart',
  ALL_ANIMATION_END = 'allAnimationEnd'
}

export enum GrammarTypeEnum {
  signal = 'signal',
  data = 'data',
  scale = 'scale',
  coordinate = 'coordinate',
  mark = 'mark'
}

export enum InteractionStateEnum {
  active = 'active',
  selected = 'selected',
  highlight = 'highlight',
  blur = 'blur'
}
