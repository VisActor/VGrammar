# View

VGrammar 中的视图，用于创建具体的图形，`IViewConstructor`的定义如下：

```ts
interface IViewConstructor {
  new (options?: IViewOptions, config?: IViewThemeConfig): IView;
}
```

使用示例如：

```ts
import { View } from '@visactor/vgrammar';

const view = new View({
  autoFit: true,
  container: 'container', // the id of a div element
  hover: true
});

view.parseSpec({
  /**
   * some spec
   */
});

view.renderSync();
```

其中`options`支持如下配置：

```ts
interface IEnvironmentOptions {
  /** 环境参数 */
  mode?: EnvType;
  /**
   * 环境带的配置
   */
  modeParams?: any;
}

interface IRendererOptions {
  dpr?: number;
  viewBox?: IBoundsLike;
  container?: string | HTMLElement;
  /** 背景颜色 */
  background?: IColor;
  /** 非浏览器环境下，如小程序，需要传入经过包装的伪 canvas 实例 */
  renderCanvas?: string | HTMLCanvasElement;
  /** 是否是受控制的canvas，如果不是的话，不会进行resize等操作 */
  canvasControled?: boolean;
  /** vRender stage */
  stage?: IStage;
  /** vRender layer */
  layer?: ILayer;
  rendererTitle?: string;
  /* 渲染风格 */
  renderStyle?: string;
  /** vRender是否完整绘制 */
  fullDraw?: boolean;
  /** vRender渲染引擎类型，'2d' | '3d' */
  engine?: string;
  pickMode?: string;
  webglOptions?: any;
  preserveDrawingBuffer?: boolean;
  /** 是否使用vRender 自定义ticker */
  customTicker?: boolean;
  /** renderer类型配置 */
  renderer?: string;
  /* 是否关闭dirtyBounds */
  disableDirtyBounds?: boolean;
  beforeRender?: (stage: IStage) => void;
  afterRender?: (stage: IStage) => void;
}

interface ILayoutOptions {
  parseMarkBounds?: (bounds: IBounds, mark: IMark) => IBounds;
  doLayout?: (marks: IMark[], options: ILayoutOptions, view: IView) => void;
}

interface srIOption3DType extends IOption3D {
  enable?: boolean;
  /* 是否支持3d视角变换 */
  enableView3dTranform?: boolean;
}

interface IViewOptions extends IEnvironmentOptions, IRendererOptions, ILayoutOptions {
  width?: number;
  height?: number;
  padding?: CommonPaddingSpec;
  autoFit?: boolean;

  options3d?: srIOption3DType;

  /** 是否默认配置hover交互 */
  hover?: boolean;
  /** 是否开启选中交互 */
  select?: boolean;

  /** 是否启用 cursor 设置 */
  cursor?: boolean;

  /** FIXME 函数 */
  functions?: Record<string, any>;

  /** 外部传入的logger方法 */
  logger?: Logger;
  loader?: any;
  /**
   * 0 - None
   * 1 - Error
   * 2 - Warn
   * 3 - Info
   * 4 - Debug
   */
  logLevel?: number;

  /** worker 专用 */
  domBridge?: any;

  /** 生命周期等事件钩子 */
  hooks?: Hooks;

  /**
   * 事件相关配置
   * {
   *    defaults: {
   *      prevent: ['mousemove', 'mouseenter']
   *    }
   * }
   */
  eventConfig?: IViewEventConfig;
}
```

## renderer

**【只读属性】**，获取底层渲染器

## rootMark

**【只读属性】**，获取`Mark`的根元素

## grammars

**【只读属性】**，获取所有的语法元素对应的实例

## signal(function)

创建`Signal`实例，对应的 ts 类型定义为：

```ts
<T>(value?: T, update?: SignalFunctionType<T>) => ISignal<T>;
```

接收两个参数，第一个参数用于设置初始值，第二个参数用于设置更新的回调函数；当依赖的语法元素发生更新的时候，会调用第二个参数设置的回调函数进行更新；返回值为`Signal`实例；

其中第二个参数配置含义如下：

支持多种格式的配置：

- 格式 1:

```ts
(...args: any[]) => T;
```

其中`T`是 ts 类型定义的范形，表示`Signal`值的类型；

- 格式 2:

```ts
interface SignalReference {
  signal: string | ISignal<any>;
}
```

用于配置当前元素依赖其他的`signal`实例的值

- 格式 3:

```ts
interface SignalFunction<T> {
  callback: (...args: any[]) => T;
  dependency?: SignalDependency | SignalDependency[];
}
```

通过属性`dependency`设置依赖的语法元素对应的`id`或者实例，通过`callback`设置自定义的回调函数，计算当前元素的更新方法

使用示例如下：

```ts
const isMouseEnter = view.signal(false).id('isMouseEnter');
const mouseMovePosition = view.signal(null).id('mouseMovePosition');
const tooltipPosition = view
  .signal(null, (signal: ISignal, params: any) => {
    return params.isMouseEnter ? mouseMovePosition : null;
  })
  .depend(['isMouseEnter', 'mouseMovePosition']);
```

## data(function)

创建`Data`实例，对应的 ts 类型定义为：

```ts
(values?: any[]) => IData;
```

接收一个可选参数为数据对应的原始值;
使用方法如：

```ts
view.data([{ a: 1, b: 2 }]);
```

## scale(function)

创建`Scale`实例，

对应的 ts 类型定义为：

```ts
(type: GrammarScaleType) => IScale;
```

接收一个参数，用于申明`Scale`的类型，支持的类型有：

- 'linear'
- 'log'
- 'pow'
- 'sqrt'
- 'symlog'
- 'time'
- 'utc'
- 'quantile'
- 'quantize'
- 'threshold'
- 'ordinal'
- 'point'
- 'band'

使用示例如下：

```ts
view.scale('linear');
```

## coordinate(function)

创建`Coordinate` 实例；ts 类型定义如下：

```ts
(type: CoordinateType) => ICoordinate;
```

接收一个参数，用于申明`Coordinate`的类型，支持的类型有：

- 'cartesian'
- 'polar'

## mark(function)

创建`Mark` 实例, ts 类型定义如下

```ts
(
  type: MarkType,
  group: IGroupMark | string,
  markOptions?: { glyphType?: string; componentType?: string; mode?: '2d' | '3d' }
) => IMark;
```

第一个参数`type`对应的是`Mark`的类型，支持的类型有：

- 'arc'
- 'area'
- 'circle'
- 'image'
- 'line'
- 'path'
- 'rect'
- 'rule'
- 'shape'
- 'symbol'
- 'text'
- 'richtext'
- 'polygon'
- 'rect3d'
- 'pyramid3d'
- 'arc3d'
- 'cell'
- 'interval'
- 'group'
- 'glyph'
- 'component'

第二个参数`group`，用于设置当前`mark` 的父节点，支持两种格式：

- 设置父节点`mark`的`id`
- 设置父节点`mark`实例

如果不设置，默认值为`rootMark`

第三个参数`markOptions`，用于设置更多的属性，参数类型为`Object`，对应的 ts 类型定义为：

```ts
{ glyphType?: string; componentType?: string; mode?: '2d' | '3d' }
```

- `glyphType`: 用于设置具体的`glyph`的类型，仅当`type = 'glyph'`时有效
- `componentType`: 用于设置具体的组件类型，仅当`type = 'component'`时有效
- `mode`: 用于设置是否支持 3d 模式，仅当`type = 'component' & componentType = "axis" `时有效

## group(function)

创建`GroupMark` 实例，ts 类型定义如下：

```ts
(group: IGroupMark | string) => IGroupMark;
```

以下两种使用方法是等价的：

```ts
// 调用mark() API创建`GroupMark`

view.mark('group', view.rootMark);
```

```ts
// group() API创建`GroupMark`

view.group(view.rootMark);
```

## glyph(function)

创建`GlyphMark`实例，ts 类型定义如下：

```ts
(glyphType: string, group: IGroupMark | string) => IGlyphMark;
```

以下两种使用方法是等价的：

```ts
// 调用mark() API创建`GlyphMark`

view.mark('glyph', view.rootMark, { glyphType: 'linkPath' });
```

```ts
// glyph() API创建`GlyphMark`

view.glyph('linkPath', view.rootMark);
```

## component(function)

创建`Component`实例，ts 类型定义如下：

```ts
(componentType: string, group: IGroupMark | string, mode?: '2d' | '3d') => IComponent;
```

以下两种使用方法是等价的：

```ts
// 调用mark() API创建`Component`

view.mark('component', view.rootMark, { componentType: 'axis', mode: '3d' });
```

```ts
// glyph() API创建`GlyphMark`

view.component('axis', view.rootMark, { mode: '3d' });
```

## axis(function)

创建坐标轴组件，ts 类型定义如下：

```ts
(group: IGroupMark | string, mode?: '2d' | '3d') => IAxis;
```

以下三种使用方法是等价的：

```ts
// 调用mark() API创建坐标轴组件

view.mark('component', view.rootMark, { componentType: 'axis', mode: '3d' });
```

```ts
// component() API创建坐标轴

view.component('axis', view.rootMark, { mode: '3d' });
```

```ts
// axis() API创建坐标轴

view.axis(view.rootMark, { mode: '3d' });
```

## legend(function)

创建 图例 组件，ts 类型定义如下：

```ts
(group: IGroupMark | string) => ILegend;
```

以下三种使用方法是等价的：

```ts
// 调用mark() API创建组件

view.mark('component', view.rootMark, { componentType: 'legend' });
```

```ts
// component() API创建组件

view.component('${componentType}', view.rootMark);
```

```ts
// legend() API创建组件

view.legend(view.rootMark);
```

## crosshair(function)

创建 crosshair 组件，ts 类型定义如下：

```ts
(group: IGroupMark | string) => ICrosshair;
```

以下三种使用方法是等价的：

```ts
// 调用mark() API创建组件

view.mark('component', view.rootMark, { componentType: 'crosshair' });
```

```ts
// component() API创建组件

view.component('crosshair', view.rootMark);
```

```ts
// corsshair() API创建组件

view.corsshair(view.rootMark);
```

## slider(function)

创建 slider 组件，ts 类型定义如下：

```ts
(group: IGroupMark | string) => ISlider;
```

以下三种使用方法是等价的：

```ts
// 调用mark() API创建组件

view.mark('component', view.rootMark, { componentType: 'slider' });
```

```ts
// component() API创建组件

view.component('slider', view.rootMark);
```

```ts
// slider() API创建组件

view.slider(view.rootMark);
```

## label(function)

创建 label 组件，ts 类型定义如下：

```ts
(group: IGroupMark | string) => ILabel;
```

以下三种使用方法是等价的：

```ts
// 调用mark() API创建组件

view.mark('component', view.rootMark, { componentType: 'label' });
```

```ts
// component() API创建组件

view.component('label', view.rootMark);
```

```ts
// label() API创建组件

view.label(view.rootMark);
```

## player(function)

创建 player 组件，ts 类型定义如下：

```ts
(group: IGroupMark | string) => IPlayer;
```

以下三种使用方法是等价的：

```ts
// 调用mark() API创建组件

view.mark('component', view.rootMark, { componentType: 'player' });
```

```ts
// component() API创建组件

view.component('player', view.rootMark);
```

```ts
// player() API创建组件

view.player(view.rootMark);
```

## tooltip(function)

创建 tooltip 组件，ts 类型定义如下：

```ts
(group: IGroupMark | string) => ITooltip;
```

以下三种使用方法是等价的：

```ts
// 调用mark() API创建组件

view.mark('component', view.rootMark, { componentType: 'tooltip' });
```

```ts
// component() API创建组件

view.component('tooltip', view.rootMark);
```

```ts
// tooltip() API创建组件

view.tooltip(view.rootMark);
```

## getGrammarById(function)

根据`id`获取语法元素的方法，ts 类型定义如下：

```ts
(id: string) => IGrammarBase | null;
```

## getCustomizedById(function)

根据`id`获取自定义语法元素的方法，ts 类型定义如下：

```ts
(id: string) => IGrammarBase | null;
```

## getSignalById(function)

根据`id`获取语法元素 Signal 实例的方法，ts 类型定义如下：

```ts
(id: string) => ISignal | null;
```

## getDataById(function)

根据`id`获取语法元素 Data 实例的方法，ts 类型定义如下：

```ts
(id: string) => IData | null;
```

## getScaleById(function)

根据`id`获取语法元素 Scale 实例的方法，ts 类型定义如下：

```ts
(id: string) => IScale | null;
```

## getCoordinateById(function)

根据`id`获取语法元素 Coordinate 实例的方法，ts 类型定义如下：

```ts
(id: string) => ICoordinate | null;
```

## getMarkById(function)

根据`id`获取语法元素 Mark 实例的方法，ts 类型定义如下：

```ts
(id: string) => IMark | null;
```

## getGrammarsByName(function)

根据申明的`name`属性，获取所有具有该属性的语法元素的方法，ts 类型定义如下：

```ts
(name: string) => IGrammarBase[];
```

## getGrammarsByType(function)

根据`type`属性，获取所有具有该属性的语法元素的方法，ts 类型定义如下：

```ts
(grammarType: string) => IGrammarBase[];
```

现在支持的`grammarType` 有：

- 'data'
- 'signal'
- 'scale'
- 'mark'
- 'coordinate'

以及自定义注册的语法元素，如'projection'

## getMarksByType(function)

根据`mark`的类型，返回所有该类型的`mark`实例，ts 类型定义如下：

```ts
(markType: string) => IMark[];

```

其中`markType`支持的枚举值参考上面的`mark()`方法

## parseSpec(function)

通过一个统一的`spec`配置，设置所有的语法元素,ts 类型定义如下：

```ts
(spec: ViewSpec) => this;
```

## updateSpec(function)

更新`spec`配置,ts 类型定义如下：

```ts
(spec: ViewSpec) => this;
```

## run(function)

运行整个 View，ts 类型定义如下：

```ts
(morphConfig?: IMorphConfig) => this;
```

其中`morphConfig`用于设置，更新`view`的时候，全局切换动画相关配置

## runNextTick(function)

和`run`类似，参数和类型定义一样，不同的是，在下一帧率的时候运行整个 View

## runAsync(function)

和`run`类似，异步运行整个 View 的更新逻辑；使用示例如下：

```ts
await view.runAsync();

console.log(view);
```

## runSync(function)

和`run`类似，参数和类型定义一样，同步运行整个 View 的更新逻辑

## runBefore(function)

设置每次 view 运行更新之前的回调函数，ts 类型定义如下:

```ts
(callback: (view: IView) => void) => this;
```

## runAfter(function)

设置每次 view 运行完成之后的回调函数，ts 类型定义如下:

```ts
(callback: (view: IView) => void) => this;
```

## background(function)

设置或者读取背景颜色，ts 类型定义如下:

```ts
(value?: IColor) => IColor;
```

## width(function)

设置或者读取 整个 canvas 的宽度，ts 类型定义如下:

```ts
(value?: number) => number;
```

## height(function)

设置或者读取 整个 canvas 的高度，ts 类型定义如下:

```ts
(value?: number) => number;
```

## viewWidth(function)

设置或者读取 view 去掉`padding`后的 画布宽度，ts 类型定义如下:

```ts
(value?: number) => number;
```

## viewHeight(function)

设置或者读取 view 去掉`padding`后的 画布高度，ts 类型定义如下:

```ts
(value?: number) => number;
```

## padding(function)

设置或者读取 `padding`，ts 类型定义如下:

```ts
(p?: number | { left?: number; right?: number; top?: number; bottom?: number }) => {
  left: number;
  right: number;
  top: number;
  bottom: number;
};
```

## addEventListener(function)

添加事件监听，ts 类型定义如下:

```ts
(type: string, handler: BaseEventHandler, options?: any) => this;
```

## removeEventListener(function)

移除事件监听，ts 类型定义如下:

```ts
(type: string, handler: BaseEventHandler) => this;
```

## emit(function)

触发自定义事件，ts 类型定义如下:

```ts
(event: string | symbol, ...args: EventEmitter.EventArgs<string | symbol, T>) => boolean;
```

第一个参数为自定义的事件名称；
其他参数为，事件对应的自定义参数

## resize(function)

调整 canvas 的宽度高度，ts 类型定义如下:

```ts
(width: number, height: number, render?: boolean) => Promise<this>;
```

当`width`或者`height`发生改变的时候，`render`不为`false` 的话，会触发底层图形的重绘

## tranverseMarkTree(function)

遍历整个 mark 实例树，执行相应逻辑，ts 类型定义如下:

```ts
(apply: (mark: IMark) => any, filter?: (mark: IMark) => boolean, leafFirst?: boolean) => this;
```

第一个参数用于设置针对每个`mark`实例执行的回调函数；
第二个参数用于设置针对每个`mark`实例执行的过滤函数；
第三个参数用于设置是否叶子节点优先执行

## pauseProgressive(function)

暂停渐进渲染流程，如果有的话

## resumeProgressive(function)

重启渐进渲染流程，如果有的话

## restartProgressive(function)

重启渐进渲染流程，如果有的话

## release(function)

释放销毁 view
