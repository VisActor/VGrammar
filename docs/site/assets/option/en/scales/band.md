{{ target: scales-band }}

# scales.band

`band` scale is mainly used to map discrete data to continuous intervals.

## type(string) = 'band'

Set the scale type to `band`

{{ use: scales-common-domain(prefix = '#') }}

{{ use: scales-common-range(prefix = '#') }}

## round(boolean)=false

Type: `ScaleFunctionType<boolean>`
Whether to automatically round the segmented coordinates, supporting multiple values:

- `boolean`
- `function`, which accepts parameters `scale` and `params`, returning a `boolean` value

## padding(number)

Set the values of `paddingInner` and `paddingOuter` uniformly to one value

## paddingInner(number)

The proportion of padding between groups

## paddingOuter(number)

The proportion of outer padding

## align(number)

The alignment point, centered by default