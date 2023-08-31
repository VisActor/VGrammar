{{ target: scales-linear }}

# scales.linear

## type(string) = 'linear'

设置刻度类型为 `linear`

{{ use: scales-common-domain(prefix = '#') }}

{{ use: scales-common-range(prefix = '#') }}

{{ use: scales-common-nice(prefix = '#') }}

{{ use: scales-common-niceminmax(prefix = '#') }}

{{ use: scales-common-uservalue(prefix = '#') }}

## roundRange(boolean)

是否对值域自动取整

## config(object)

`scale`的配置项

### clamp(boolean)

clamp 的值域

### interpolate(function)

差值函数
