{{ target: scales-symlog }}

# scales.symlog

## type(string) = 'symlog'

设置刻度类型为 `symlog`

## constant(number)

当数据小于 0 的时候，`scale()`结果的返回值设置为这个值

{{ use: scales-common-function(returnType = 'number') }}

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
