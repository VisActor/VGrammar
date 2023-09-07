{{ target: scales-utc }}

# scales.utc

## type(string) = 'utc'

Set the scale type to `utc`

{{ use: scales-common-domain(prefix = '#') }}

{{ use: scales-common-range(prefix = '#') }}

{{ use: scales-common-nice(prefix = '#') }}

{{ use: scales-common-uservalue(prefix = '#') }}

## roundRange(boolean)

Whether to round the range automatically

## config(object)

Configuration options for `scale`

### clamp(boolean)

Clamp the value range

### interpolate(function)

Interpolation function