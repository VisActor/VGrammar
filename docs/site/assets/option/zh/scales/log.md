{{ target: scales-log }}

# scales.log

## type(string) = 'log'

设置刻度类型为 `log`

## log(number)=10

`log`函数的底数，注意一定要是大于 0 的正数，默认值为 10；

{{ use: scales-common-function(returnType = 'number') }}

{{ use: scales-common-domain(prefix = '#') }}

{{ use: scales-common-range(prefix = '#') }}

{{ use: scales-common-nice(prefix = '#') }}

{{ use: scales-common-uservalue(prefix = '#') }}

## roundRange(boolean)

是否对值域自动取整

## config(object)

`scale`的配置项

### clamp(boolean)

clamp 的值域

### interpolate(function)

差值函数
