{{ target: scales-log }}

# scales.log

## type(string) = 'log'

Set the scale type to `log`

## log(number)=10

The base of the `log` function must be a positive number greater than 0, with the default value being 10.

{{ use: scales-common-function(returnType = 'number') }}

{{ use: scales-common-domain(prefix = '#') }}

{{ use: scales-common-range(prefix = '#') }}

{{ use: scales-common-nice(prefix = '#') }}

{{ use: scales-common-uservalue(prefix = '#') }}

## roundRange(boolean)

Automatically round the range value

## config(object)

`scale` configuration options

### clamp(boolean)

clamp the range value

### interpolate(function)

Interpolation function