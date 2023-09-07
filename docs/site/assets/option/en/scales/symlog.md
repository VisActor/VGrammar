{{ target: scales-symlog }}

# scales.symlog

## type(string) = 'symlog'

Set the scale type to `symlog`

## constant(number)

When the data is less than 0, the return value of `scale()` is set to this value

{{ use: scales-common-function(returnType = 'number') }}

{{ use: scales-common-domain(prefix = '#') }}

{{ use: scales-common-range(prefix = '#') }}

{{ use: scales-common-nice(prefix = '#') }}

{{ use: scales-common-niceminmax(prefix = '#') }}

{{ use: scales-common-uservalue(prefix = '#') }}

## roundRange(boolean)

Whether to round the value domain automatically

## config(object)

Configuration options for `scale`

### clamp(boolean)

Value domain of clamp

### interpolate(function)

Interpolation function