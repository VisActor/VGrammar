{{ target: marks-base }}

#${prefix} zIndex(number)

设置`mark`图元对应的容器图形(group)的 zIndex

#${prefix} interactive(boolean)

类型：`boolean`
是否必传： 否

#${prefix} context(Object)

自定义的上下文，这个数据会保存到图形上

#${prefix} setCustomizedShape

设置自定义形状的回调函数，对应的 ts 类型定位如下：

```ts
(datum: any[], attrs: any, path: ICustomPath2D) => ICustomPath2D;
```

其中`ICustomPath2D` 为 VRender 提供的绘制自定义的路径一个工具类

#${prefix} support3d(boolean)

当画布设置了 3d 视角的时候，是否支持 3d 模式

#${prefix} group

设置父图元，支持两种格式：

- `'string'` 父图元对应的 id
- `'IGroupMark'` 父图元对应的语法元素，一般用于 API 调用场景

如果不设置，会默认挂在到画布的根节点下面

#${prefix} from

ts 类型定义为：

```ts
interface MarkFromSpec {
  data: string | IData;
}
```

通过`data` 属性值，申明图元依赖的数据

#${prefix} key

设置图元数据元素的唯一标志符，用于计算图形元素的数据状态，对应的 ts 类型定义为：

```ts
type MarkKeySpec = string | ((datum: any) => string);
```

也就是说，支持两种类型的格式：

- `string` 设置`key`对应的字段
- `function` 自定义设置解析`key`的回调函数

#${prefix} sort

对图元中的所有图形元素进行排序，设置对应的排序回调函数：

```ts
(datumA: any, datumB: any) => number;
```

#${prefix} groupBy

设置分组的属性，对应的 ts 类型定义为：

```ts
type MarkKeySpec = string | ((datum: any) => string);
```

也就是说，支持两种类型的格式：

- `string` 设置分组`key`对应的字段
- `function` 自定义设置解析分组`key`的回调函数

#${prefix} groupSort

对图元中的分组进行排序，设置对应的排序回调函数：

```ts
(datumA: any, datumB: any) => number;
```

#${prefix} context(object)

设置图元的上下文参数

#${prefix} coordinate(string)

设置该图元关联的坐标系对应的 id 或者坐标系对应的图形元素

#${prefix} state

设置当前图元所有图形元素的状态值，支持三种格式：

- `string` 设置图形的状态，比如说:`{ state: 'selected'}` 就是给所有的图形设置状态为`'selected'`，通常这种情况，`encode` 中也会设置`'selected'`状态对应的图形通道映射
- `string[]` 给图形设置多个状态，可以配置`stateSort`来影响对应状态执行图形通道映射的顺序
- `function` 自定义设置解析状态值的回调函数，返回参数为`string | string[]`，对应的 ts 类型定义为：

```ts
(datum: any, element: IElement, parameters: any) => string | string[];
```

#${prefix} stateSort

设置当前图元所有图形元素的状态值的排序函数，会影响状态对应的图形通道映射的顺序，最先执行的状态可能被后续的状态覆盖图形通道映射结果，对应的 ts 类型定义为：

```ts
(stateA: string, stateB: string) => number;
```

#${prefix} transform

设置图元对应的变换，所有的数据变换都可以配置在图元上，用于对图元的`join data` 执行变换；
另外一种类型的变换就是对图形元素执行的变换，比如说`dodge`；
通用的类型定义如下：

```ts
interface BaseTransformSpec {
  /** the type of transform */
  type: string;
  [key: string]: TransformSpecValue | TransformSpecValue[];
}
```

每中变换支持的参数不同

#${prefix} layout

设置图元的布局参数，图元在参与布局的时候，存在两种角色：

- 'container' 容器图元，一般是`group`图元
- 'item' 布局子元素，作为容器图元的子节点

注意，我们仅支持一层布局，如果是多层嵌套布局，建议使用自定义的布局方案进行实现；

现在支持两种内容的布局：`grid` 布局 和 `relative`布局，相关类型定义如下

```ts
type MarkLayoutCallback = (
  group: IGroupMark,
  children: IMark[],
  parentLayoutBounds: Bounds,
  options?: ILayoutOptions
) => void;

interface MarkBaseLayoutSpec {
  callback?: MarkLayoutCallback;
  skipBeforeLayouted?: boolean;
  updateViewSignals?: boolean;
}

interface MarkGridContainerSpec extends MarkBaseLayoutSpec {
  display: 'grid';
  gridTemplateRows?: (number | string | 'auto')[];
  gridTemplateColumns?: (number | string | 'auto')[];
  gridRowGap?: number;
  gridColumnGap?: number;
}

interface MarkGridItemSpec extends MarkBaseLayoutSpec {
  gridRowStart?: number;
  gridRowEnd?: number;
  gridColumnStart?: number;
  gridColumnEnd?: number;
}

interface MarkRelativeContainerSpec extends MarkBaseLayoutSpec {
  display: 'relative';
  maxChildWidth?: string | number;
  maxChildHeight?: string | number;
}

interface MarkRelativeItemSpec extends MarkBaseLayoutSpec {
  position?: 'top' | 'bottom' | 'left' | 'right' | 'content' | 'auto' | string;
  padding?: CommonPaddingSpec;
}
```

如果想要设置自定义的布局方案，`layout`也支持直接设置回调函数，回调函数的定义如下：

```ts
type MarkLayoutCallback = (
  group: IGroupMark,
  children: IMark[],
  parentLayoutBounds: Bounds,
  options?: ILayoutOptions
) => void;
```

##${prefix} display

容器图元设置布局的类型，支持两种配置：

- `'relative'` 相对布局
- `'grid'` 网格布局

##${prefix} callback

自定义该图元的回调函数，ts 类型定义为：

```ts
type MarkLayoutCallback = (
  group: IGroupMark,
  children: IMark[],
  parentLayoutBounds: Bounds,
  options?: ILayoutOptions
) => void;
```

##${prefix} skipBeforeLayouted(boolean)

在布局完成前，跳过执行阶段

##${prefix} updateViewSignals(boolean)

是否更新默认的视图信号，也就是：`padding`、`viewWidth` 和 `viewHeight`

只能在设置了`{ layout: { display: 'relative'} }`的容器图元上设置该属性

##${prefix} maxChildWidth

相对布局的父图元，设置子图元的最大宽度，支持两种格式：

- `'string'` 百分比字符串，如：`'20%'`，分母对应的是容器图元的包围盒的宽度
- `'number'` 单位为`px`，设置绝对宽度

##${prefix} maxChildHeight

相对布局的父图元，设置子图元的最大高度，支持两种格式：

- `'string'` 百分比字符串，如：`'20%'`，分母对应的是容器图元的包围盒的高度
- `'number'` 单位为`px`，设置绝对宽度

##${prefix} position

设置相对布局的子图元的位置，支持的配置有：

- 'top' 相对于父图元的顶部
- 'bottom' 相对于父图元的底部
- 'left' 相对于父图元的左侧
- 'right' 相对于父图元的右侧
- 'content' 相对于父图元的中心，也就是内容区域
- 'auto' 图元设置了坐标系的时候，根据关联的`scale`，自定计算相对于父图元的位置

##${prefix} padding

{{ use: common-padding(
  componentName = '子图元'
) }}

##${prefix} gridTemplateRows

网格布局的父图元设置行的高度

##${prefix} gridTemplateColumns

网格布局的父图元设置列的宽度

##${prefix} gridRowGap(number)

网格布局的父图元设置行行距

##${prefix} gridColumnGap(number)

网格布局的父图元设置列间距

##${prefix} gridRowStart(number)

网格布局的子图元设置行开始的位置

##${prefix} gridRowEnd(number)

网格布局的子图元设置行结束的位置

##${prefix} gridColumnStart(number)

网格布局的子图元设置列开始的位置

##${prefix} gridColumnEnd(number)

网格布局的子图元设置列结束的位置
