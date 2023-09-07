{{ target: scales-band }}

# scales.band

`band`刻度主要用于将离散的数据，映射到连续的区间

## type(string) = 'band'

设置刻度类型为 `band`

{{ use: scales-common-domain(prefix = '#') }}

{{ use: scales-common-range(prefix = '#') }}

## round(boolean)=false

类型为: `ScaleFunctionType<boolean>`
对分段的坐标，是否自动取整，支持多种值：

- `boolean`
- `function`，接受参数`scale`和`params`，返回一个`boolean`值

## padding(number)

将`paddingInner`和`paddingOuter`的值统一设置为一个值

## paddingInner(number)

分组之间的 padding 占比

## paddingOuter(number)

外部 padding 占比

## align(number)

对齐的点，默认居中对齐
