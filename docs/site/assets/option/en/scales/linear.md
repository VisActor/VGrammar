{{ target: scales-linear }}

# scales.linear

## type(string) = 'linear'

Set the scale type to `linear`

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

Range of clamp values

### interpolate(function)

Interpolation function