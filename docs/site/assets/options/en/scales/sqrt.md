{{ target: scales-sqrt }}

# scales.sqrt

## type(string) = 'sqrt'

Set the scale type to `sqrt`

{{ use: scales-common-domain(prefix = '#') }}

{{ use: scales-common-range(prefix = '#') }}

{{ use: scales-common-nice(prefix = '#') }}

{{ use: scales-common-niceminmax(prefix = '#') }}

{{ use: scales-common-uservalue(prefix = '#') }}

## roundRange(boolean)

Whether to round the value range automatically

## config(object)

Configuration options for `scale`

### clamp(boolean)

Value range of clamp

### interpolate(function)

Interpolation function