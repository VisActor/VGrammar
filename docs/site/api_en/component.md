# Component

Graphic syntax elements - components.

Inherit `Mark`. All APIs supported by `Mark` can be called on the `Component` instance.

## Instance properties

### componentType

Type: `string`

The component type.

### Instance methods

### configureComponent

Configuring components.

```ts
(config: any) => this;
```

### scale

Set the scale of the component. Currently, three types of components can be set with `scale`:

- `Axis`
- `Crosshair`
- `Legend`

```ts
(scale?: IScale | string) => this;
```

### axisType(string)

Set the axis type of the `Axis` component.

```ts
(axisType: AxisType | Nil) => this;
```

### tickCount

Set the number of ticks of the `Axis` component.

```ts
(tickCount: MarkFunctionType<number> | Nil) => this;
```

### legendType(string)

Set the legend type of the `Legend` component.

```ts
(legendType: LegendType | Nil) => this;
```

### target

Set the target data of the component.

```ts
(data: IData | string | Nil, filter: string | ((datum: any, legendValues: any) => boolean) | Nil) => this;
```

### setSelected

Set the selected value of the `Legend` component.

```ts
(selectedValues: any[]) => this;
```

### crosshairType(string)

Set the type of the `Crosshair` component.

```ts
(crosshairType: CrosshairType | Nil) => this;
```

### crosshairShape(string)

Set the shape of the `Crosshair` component.

```ts
(crosshairShape: CrosshairShape | Nil) => this;
```

### min

Set the minimum value of the `Slider` component.

```ts
(min: MarkFunctionType<number> | Nil) => this;
```

### max

Set the maximum value of the `Slider` component.

```ts
(max: MarkFunctionType<number> | Nil) => this;
```

### setStartEndValue

Set the start value and end value of the `Slider` component.

```ts
(start?: number, end?: number) => this;
```

### preview

Set the preview value of the `Datazoom` component.

```ts
(
  data: IData | string | Nil,
  x: ScaleEncodeType | Nil,
  y: ScaleEncodeType | Nil,
  x1?: ChannelEncodeType | Nil,
  y1?: ChannelEncodeType | Nil
) => this;
```

### labelStyle

Set the label style of the `Label` component.

```ts
(attributes: MarkFunctionType<RecursivePartial<BaseLabelAttrs>>) => this;
```

### size

Set the size of the `Label` component.

```ts
(attributes: MarkFunctionType<DataLabelAttrs['size']>) => this;
```

### playerType(string)

Set the player type of the `Player` component.

```ts
(playerType: PlayerType) => this;
```

### play

Play the `Player` component.

### pause

Pause the `Player` component.

### backward

Component `Player` rewind.

### forward

Component `Player` forward.

### title

Set the title of the `Tooltip` component.

```ts
(title: ITooltipRow | Nil) => this;
```

### content

Set the content of the `Tooltip` component.

```ts
(content: ITooltipRow | ITooltipRow[] | Nil) => this;
```
