{{ target: scales-pow }}

# scales.pow

## type(string) = '.pow'

Set scale type to `pow`

## exponent(number)=1

Set the exponent for the power function

{{ use: scales-common-function(returnType = 'number') }}

{{ use: scales-common-domain(prefix = '#') }}

{{ use: scales-common-range(prefix = '#') }}

{{ use: scales-common-nice(prefix = '#') }}

{{ use: scales-common-niceminmax(prefix = '#') }}

{{ use: scales-common-uservalue(prefix = '#') }}

## roundRange(boolean)

Whether to round range values automatically

## config(object)

Configuration options for `scale`

### clamp(boolean)

Value range for clamp

### interpolate(function)

Interpolation function