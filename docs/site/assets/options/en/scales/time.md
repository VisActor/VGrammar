{{ target: scales-time }}

# scales.time

## type(string) = 'time'

Set the scale type to `time`

{{ use: scales-common-domain(prefix = '#') }}

{{ use: scales-common-range(prefix = '#') }}

{{ use: scales-common-nice(prefix = '#') }}

{{ use: scales-common-uservalue(prefix = '#') }}

## roundRange(boolean)

Whether to automatically round the value range

## config(object)

Configuration options for `scale`

### clamp(boolean)

Value range of clamp

### interpolate(function)

Interpolation function