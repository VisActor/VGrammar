# View

## Initialization

Views in VGrammar are used to create specific graphics. The definition of `IViewConstructor` is as follows:

```ts
interface IViewConstructor {
  new (options?: IViewOptions, config?: IViewThemeConfig): IView;
}
```

Usage example:

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

The `options` support the following configurations:

| Property Name      | Type                        | Mandatory | Description                                                                                                                                       |
| ------------------ | --------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| width              | `number`                    | No        | Sets the width of the canvas                                                                                                                      |
| height             | `number`                    | No        | Sets the height of the canvas                                                                                                                     |
| container          | `string\| HTMLElement`      | No        | Sets the `id` or dom element of the container                                                                                                     |
| padding            | `CommonPaddingSpec`         | No        | Sets the padding of the canvas                                                                                                                    |
| autoFit            | `boolean`                   | No        | Whether to automatically calculate the width and height of the canvas based on the container size                                                 |
| options3d          | `srIOption3DType`           | No        | 3d related configuration, supports two properties\n`enable`: Enable 3d rendering; `enableView3dTranform`: Support 3d viewing angle transformation |
| hover              | `boolean`                   | No        | Whether to configure hover interaction by default                                                                                                 |
| select             | `boolean`                   | No        | Whether to enable selection interaction                                                                                                           |
| cursor             | `boolean`                   | No        | Whether to enable cursor settings                                                                                                                 |
| logger             | `Logger`                    | No        | Externally provided logger method                                                                                                                 |
| logLevel           | `number`                    | No        | Sets the log level, 0 - None; 1 - Error; 2 - Warn; 3 - Info; 4 - Debug                                                                            |
| domBridge          | `any`                       | No        | worker exclusive                                                                                                                                  |
| hooks              | `Hooks`                     | No        | Lifecycle and other event hooks                                                                                                                   |
| eventConfig        | `IViewEventConfig`          | No        | Event related configuration                                                                                                                       |
| mode               | `EnvType`                   | No        | Environmental parameters                                                                                                                          |
| modeParams         | `any`                       | No        | Custom configurations for various environments                                                                                                    |
| dpr                | `number`                    | No        | Pixel ratio                                                                                                                                       |
| viewBox            | `IBoundsLike`               | No        | Manually set the ViewBox where the canvas is located                                                                                              |
| background         | `IColor`                    | No        | Background color                                                                                                                                  |
| renderCanvas       | `string\|HTMLCanvasElement` | No        | In non-browser environments, such as mini-programs, you need to pass in a wrapped pseudo canvas instance                                          |
| canvasControled    | `boolean`                   | No        | Whether it is a controlled canvas, if not, no resize operations will be performed                                                                 |
| stage              | `IStage`                    | No        | vRender stage                                                                                                                                     |
| layer              | `ILayer`                    | No        | vRender layer                                                                                                                                     |
| rendererTitle      | `string`                    | No        | When the container is not set, the `title` attribute is set on the dom element automatically created internally                                   |
| renderStyle        | `string`                    | No        | Rendering style                                                                                                                                   |
| disableDirtyBounds | `boolean`                   | No        | Whether to disable dirtyBounds                                                                                                                    |
| beforeRender       | `beforeRender`              | No        |                                                                                                                                                   |
| afterRender        | `afterRender`               | No        |                                                                                                                                                   |
| parseMarkBounds    | `parseMarkBounds`           | No        |                                                                                                                                                   |
| doLayout           | `doLayout`                  | No        |                                                                                                                                                   |

## Instance Properties

### renderer

**【Read-only property】**，get the underlying renderer

### rootMark

**【Read-only property】**，get the root element of `Mark`

### grammars

**【Read-only property】**，get instances corresponding to all grammar elements

## Instance Methods

### signal

Create a `Signal` instance, and the corresponding ts type definition is:

```ts
<T>(value?: T, update?: SignalFunctionType<T>) => ISignal<T>;
```

Accept two parameters, the first parameter is used to set the initial value, and the second parameter is used to set the updater callback function; when the dependent grammar elements are updated, the callback function set by the second parameter will be called for updates; The return value is a `Signal` instance;

The meanings of the second parameter configuration are as follows:

Support multiple formatting configurations:

- Format 1:

```ts
(...args: any[]) => T;
```

Where `T` is the type definition of ts generic, meaning the type of `Signal` value;

- Format 2:

```ts
interface SignalReference {
  signal: string | ISignal<any>;
}
```

For configuring the current element depends on the value of other `signal` instances

- Format 3:

```ts
interface SignalFunction<T> {
  callback: (...args: any[]) => T;
  dependency?: SignalDependency | SignalDependency[];
}
```

Set the dependent grammar element corresponding to `id` or instance through the `dependency` property, set a custom callback function through `callback`, and calculate the update method for the current element

Usage example:

```ts
const isMouseEnter = view.signal(false).id('isMouseEnter');
const mouseMovePosition = view.signal(null).id('mouseMovePosition');
const tooltipPosition = view
  .signal(null, (signal: ISignal, params: any) => {
    return params.isMouseEnter ? mouseMovePosition : null;
  })
  .depend(['isMouseEnter', 'mouseMovePosition']);
```

### data

Create a `Data` instance, with the corresponding ts type definition being:

```ts
(values?: any[]) => IData;
```

Accept an optional parameter for the raw value of the data;
Using method as:

```ts
view.data([{ a: 1, b: 2 }]);
```

### scale

Create a `Scale` instance,

corresponding ts type definition is:

```ts
(type: GrammarScaleType) => IScale;
```

Accept a parameter to declare the type of `Scale`, supported types include:

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

Usage example:

```ts
view.scale('linear');
```

### coordinate

Create a `Coordinate` instance; ts type definition is:

```ts
(type: CoordinateType) => ICoordinate;
```

Accept a parameter to declare the type of `Coordinate`, supported types include:

- 'cartesian'
- 'polar'

### mark

Create a `Mark` instance, ts type definition is:

```ts
(
  type: MarkType,
  group: IGroupMark | string,
  markOptions?: { glyphType?: string; componentType?: string; mode?: '2d' | '3d' }
) => IMark;
```

The first parameter `type` corresponds to the type of `Mark`, and the supported types include:

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

The second parameter `group` is used to set the parent node of the current `mark`, supporting two types:

- Set the `id` of the parent `mark`
- Set the parent `mark` instance

If not set, the default value is `rootMark`.

The third parameter `markOptions` is used to set more properties. The parameter type is `Object`, and the corresponding ts type definition is:

```ts
{ glyphType?: string; componentType?: string; mode?: '2d' | '3d' }
```

- `glyphType`: used to set the specific `glyph` type, valid only when `type = 'glyph'`
- `componentType`: used to set the specific component type, effective only when `type = 'component'`
- `mode`: used to set whether to support 3d mode, effective only when `type = 'component' & componentType = "axis" `

### group

Create a `GroupMark` instance, ts type definition is:

```ts
(group: IGroupMark | string) => IGroupMark;
```

The following two usage methods are equivalent:

```ts
// Call mark() API to create `GroupMark`

view.mark('group', view.rootMark);
```

```ts
// group() API to create `GroupMark`

view.group(view.rootMark);
```

### glyph

Create a `GlyphMark` instance, ts type definition is:

```ts
(glyphType: string, group: IGroupMark | string) => IGlyphMark;
```

The following two usage methods are equivalent:

```ts
// Call mark() API to create `GlyphMark`

view.mark('glyph', view.rootMark, { glyphType: 'linkPath' });
```

```ts
// glyph() API to create `GlyphMark`

view.glyph('linkPath', view.rootMark);
```

### component

Create a `Component` instance, ts type definition as follows:

```ts
(componentType: string, group: IGroupMark | string, mode?: '2d' | '3d') => IComponent;
```

The following two usage methods are equivalent:

```ts
// Create a `Component` using the mark() API

view.mark('component', view.rootMark, { componentType: 'axis', mode: '3d' });
```

```ts
// Create a `GlyphMark` using the glyph() API

view.component('axis', view.rootMark, { mode: '3d' });
```

### axis

Create an axis component, ts type definition as follows:

```ts
(group: IGroupMark | string, mode?: '2d' | '3d') => IAxis;
```

The following three usage methods are equivalent:

```ts
// Create an axis component using the mark() API

view.mark('component', view.rootMark, { componentType: 'axis', mode: '3d' });
```

```ts
// Create an axis using the component() API

view.component('axis', view.rootMark, { mode: '3d' });
```

```ts
// Create an axis using the axis() API

view.axis(view.rootMark, { mode: '3d' });
```

### legend

Create a legend component, ts type definition as follows:

```ts
(group: IGroupMark | string) => ILegend;
```

The following three usage methods are equivalent:

```ts
// Create a component using the mark() API

view.mark('component', view.rootMark, { componentType: 'legend' });
```

```ts
// Create a component using the component() API

view.component('${componentType}', view.rootMark);
```

```ts
// Create a component using the legend() API

view.legend(view.rootMark);
```

### crosshair

Create a crosshair component, ts type definition as follows:

```ts
(group: IGroupMark | string) => ICrosshair;
```

The following three usage methods are equivalent:

```ts
// Create a component using the mark() API

view.mark('component', view.rootMark, { componentType: 'crosshair' });
```

```ts
// Create a component using the component() API

view.component('crosshair', view.rootMark);
```

```ts
// Create a component using the corsshair() API

view.corsshair(view.rootMark);
```

### slider

Create a slider component, ts type definition as follows:

```ts
(group: IGroupMark | string) => ISlider;
```

The following three usage methods are equivalent:

```ts
// Create a component using the mark() API

view.mark('component', view.rootMark, { componentType: 'slider' });
```

```ts
// Create a component using the component() API

view.component('slider', view.rootMark);
```

```ts
// Create a component using the slider() API

view.slider(view.rootMark);
```

### label

Create a label component, ts type definition as follows:

```ts
(group: IGroupMark | string) => ILabel;
```

The following three usage methods are equivalent:

```ts
// Create a component using the mark() API

view.mark('component', view.rootMark, { componentType: 'label' });
```

```ts
// Create a component using the component() API

view.component('label', view.rootMark);
```

```ts
// Create a component using the label() API

view.label(view.rootMark);
```

### player

Create a player component, ts type definition as follows:

```ts
(group: IGroupMark | string) => IPlayer;
```

The following three usage methods are equivalent:

```ts
// Create a component using the mark() API

view.mark('component', view.rootMark, { componentType: 'player' });
```

```ts
// Create a component using the component() API

view.component('player', view.rootMark);
```

```ts
// Create a component using the player() API

view.player(view.rootMark);
```

### tooltip

Create a tooltip component, ts type definition as follows:

```ts
(group: IGroupMark | string) => ITooltip;
```

The following three usage methods are equivalent:

```ts
// Create a component using the mark() API

view.mark('component', view.rootMark, { componentType: 'tooltip' });
```

```ts
// Create a component using the component() API

view.component('tooltip', view.rootMark);
```

```ts
// Create a component using the tooltip() API

view.tooltip(view.rootMark);
```

### getGrammarById

Method to get grammar elements by `id`, ts type definition is as follows:

```ts
(id: string) => IGrammarBase | null;
```

### getCustomizedById

Method to get custom grammar elements by `id`, ts type definition is as follows:

```ts
(id: string) => IGrammarBase | null;
```

### getSignalById

Method to get grammar element Signal instance by `id`, ts type definition is as follows:

```ts
(id: string) => ISignal | null;
```

### getDataById

Method to get grammar element Data instance by `id`, ts type definition is as follows:

```ts
(id: string) => IData | null;
```

### getScaleById

Method to get grammar element Scale instance by `id`, ts type definition is as follows:

```ts
(id: string) => IScale | null;
```

### getCoordinateById

Method to get grammar element Coordinate instance by `id`, ts type definition is as follows:

```ts
(id: string) => ICoordinate | null;
```

### getMarkById

Method to get grammar element Mark instance by `id`, ts type definition is as follows:

```ts
(id: string) => IMark | null;
```

### getGrammarsByName

Method to get all grammar elements with the declared `name` attribute, ts type definition is as follows:

```ts
(name: string) => IGrammarBase[];
```

### getGrammarsByType

Method to get all grammar elements with the `type` attribute, ts type definition is as follows:

```ts
(grammarType: string) => IGrammarBase[];
```

Currently supported `grammarType` include:

- 'data'
- 'signal'
- 'scale'
- 'mark'
- 'coordinate'

As well as custom registered grammar elements, such as 'projection'

### getMarksByType

Method to return all `mark` instances of the `mark` type, ts type definition is as follows:

```ts
(markType: string) => IMark[];

```

Refer to the `mark()` method above for supported enumeration values of `markType`

### parseSpec

Set all grammar elements through a unified `spec` configuration, ts type definition is as follows:

```ts
(spec: ViewSpec) => this;
```

### updateSpec

Update `spec` configuration, ts type definition is as follows:

```ts
(spec: ViewSpec) => this;
```

### run

Run the entire View, ts type definition is as follows:

```ts
(morphConfig?: IMorphConfig) => this;
```

Where `morphConfig` is used to set global transition animation related configurations when updating the `view`

### runNextTick

Similar to `run`, parameters and type definitions are the same, except that the entire View is run at the next frame rate

### runAsync

Similar to `run`, asynchronously run the entire View update logic; usage example is as follows:

```ts
await view.runAsync();

console.log(view);
```

### runSync

Similar to `run`, parameters and type definitions are the same, run the entire View update logic synchronously

### runBefore

Set the callback function before each view is updated and run. The ts type definition is as follows:

```ts
(callback: (view: IView) => void) => this;
```

### runAfter

Set the callback function after each view is updated and run. The ts type definition is as follows:

```ts
(callback: (view: IView) => void) => this;
```

### background

Set or read the background color. The ts type definition is as follows:

```ts
(value?: IColor) => IColor;
```

### width

Set or read the width of the entire canvas. The ts type definition is as follows:

```ts
(value?: number) => number;
```

### height

Set or read the height of the entire canvas. The ts type definition is as follows:

```ts
(value?: number) => number;
```

### viewWidth

Set or read the width of the view canvas after deducting `padding`. The ts type definition is as follows:

```ts
(value?: number) => number;
```

### viewHeight

Set or read the height of the view canvas after deducting `padding`. The ts type definition is as follows:

```ts
(value?: number) => number;
```

### padding

Set or read the `padding`. The ts type definition is as follows:

```ts
(p?: number | { left?: number; right?: number; top?: number; bottom?: number }) => {
  left: number;
  right: number;
  top: number;
  bottom: number;
};
```

### addEventListener

Add event listeners. The ts type definition is as follows:

```ts
(type: string, handler: BaseEventHandler, options?: any) => this;
```

### removeEventListener

Remove event listeners. The ts type definition is as follows:

```ts
(type: string, handler: BaseEventHandler) => this;
```

### emit

Trigger custom events. The ts type definition is as follows:

```ts
(event: string | symbol, ...args: EventEmitter.EventArgs<string | symbol, T>) => boolean;
```

The first parameter is the custom event name;
Other parameters are the custom parameters corresponding to the event.

### resize

Adjust the width and height of the canvas. The ts type definition is as follows:

```ts
(width: number, height: number, render?: boolean) => Promise<this>;
```

When the `width` or `height` changes, if `render` is not `false`, it will trigger the underlying shape redraw.

### tranverseMarkTree

Traverse the entire mark instance tree and execute the corresponding logic. The ts type definition is as follows:

```ts
(apply: (mark: IMark) => any, filter?: (mark: IMark) => boolean, leafFirst?: boolean) => this;
```

The first parameter is used to set the callback function for each `mark` instance;
The second parameter is used to set the filter function for each `mark` instance;
The third parameter is used to set whether leaf nodes have priority execution.

### pauseProgressive

Pause the progressive rendering process, if any.

### resumeProgressive

Resume the progressive rendering process, if any.

### restartProgressive

Restart the progressive rendering process, if any.

### release

Release and destroy the view.
