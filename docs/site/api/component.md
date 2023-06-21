# Component

图形语法元素 - 组件。

继承`Mark`，所有`Mark`支持的 API，都能在`Component`实例上调用

## componentType(string)

组件的类型

## configureComponent(function)

配置组件

```ts
(config: any) => this;
```

## scale(function)

设置组件的比例尺，目前有三种类型的组件是可以设置`scale`的：

- `Axis`
- `Crosshair`
- `Legend`

```ts
(scale?: IScale | string) => this;
```

## axisType(string)

设置`Axis`组件的坐标轴类型

```ts
(axisType: AxisType | Nil) => this;
```

## tickCount(function)

设置`Axis`组件的刻度数量

```ts
(tickCount: MarkFunctionType<number> | Nil) => this;
```

## legendType(string)

设置`Legend`组件的图例类型

```ts
(legendType: LegendType | Nil) => this;
```

## target(function)

设置组件的目标数据

```ts
(data: IData | string | Nil, filter: string | ((datum: any, legendValues: any) => boolean) | Nil) => this;
```

## setSelected(function)

设置`Legend`组件的选中值

```ts
(selectedValues: any[]) => this;
```

## crosshairType(string)

设置`Crosshair`组件的类型

```ts
(crosshairType: CrosshairType | Nil) => this;
```

## crosshairShape(string)

设置`Crosshair`组件的形状

```ts
(crosshairShape: CrosshairShape | Nil) => this;
```

## min(function)

设置`Slider`组件的最小值

```ts
(min: MarkFunctionType<number> | Nil) => this;
```

## max(function)

设置`Slider`组件的最大值

```ts
(max: MarkFunctionType<number> | Nil) => this;
```

## setStartEndValue(function)

设置`Slider`组件的起始值和结束值

```ts
(start?: number, end?: number) => this;
```

## preview(function)

设置`Datazoom`组件的预览值

```ts
(
  data: IData | string | Nil,
  x: ScaleEncodeType | Nil,
  y: ScaleEncodeType | Nil,
  x1?: ChannelEncodeType | Nil,
  y1?: ChannelEncodeType | Nil
) => this;
```

## labelStyle(function)

设置`Label`组件的标签样式

```ts
(attributes: MarkFunctionType<RecursivePartial<BaseLabelAttrs>>) => this;
```

## size(function)

设置`Label`组件的大小

```ts
(attributes: MarkFunctionType<DataLabelAttrs['size']>) => this;
```

## playerType(string)

设置`Player`组件的播放器类型

```ts
(playerType: PlayerType) => this;
```

## play(function)

播放`Player`组件

## pause(function)

暂停`Player`组件

## backward(function)

组件`Player`回退

## forward(function)

组件`Player`前进

## title(function)

设置`Tooltip`组件的标题

```ts
(title: ITooltipRow | Nil) => this;
```

## content(function)

设置`Tooltip`组件的内容

```ts
(content: ITooltipRow | ITooltipRow[] | Nil) => this;
```
