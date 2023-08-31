{{ target: projections-index }}

# projections(Array)

Map projection methods, documentation can be referenced:

- [d3-geo](https://github.com/d3/d3-geo)
- [d3-geo-projection](https://github.com/d3/d3-geo-projection#geoHammer)

<!-- syntax element pickion -->

{{ use: common-grammar(
    prefix = '#',
    grammarType = 'pickion'
) }}

## type(string)

Sets the type of projection transformation;
Supported types are:

- `'albers'`
- `'albersusa'`
- `'azimuthalequalarea'`
- `'azimuthalequidistant'`
- `'conicconformal'`
- `'conicequalarea'`
- `'conicequidistant'`
- `'equalEarth'`
- `'equirectangular'`
- `'gnomonic'`
- `'identity'`
- `'mercator'`
- `'naturalEarth1'`
- `'orthographic'`
- `'stereographic'`
- `'transversemercator'`

## pointRadius(number)=4.5

If `pointRadius` is specified, set the radius between `Point` and `MultiPoint` to the specified value.
If `pointRadius` is not specified, the default value returned is 4.5.
Generally, `pointRadius` is a numeric constant, but it can also be specified as a custom function.
For example, if your GeoJSON data has other attributes, you can access these attributes within the radius function to change the size of the points.

{{ use: projections-function(returnType = 'number') }}

## extent

Sets the viewPort of the projection to the specified pixel boundary.
The type of `extent` is: `[[x0, y0], [x1, y1]]`, where x0 is the left side of the viewport, y0 is the top, x1 is the right side, and y1 is the bottom, all in `px` units.
If the range is null, no viewport clipping is performed.
If not specified, the current viewport clipping range is returned, which defaults to null.
Viewport clipping is independent of the small circle clipping performed by `projection.clipAngle`.

{{ use: projections-function(returnType = '[[number, number], [number, number]]') }}

## fit(boolean)

Whether to adapt the adjustment strategy automatically, if the value is `true`, adapt the adjustment strategy automatically. Supports two types of adaptive strategies:

- `fitExtent`

Read the `extent` configuration and then call the `fitExtent` method provided by `d3`; set the scale and translate of the projection to fit the center of the specified GeoJSON object within the given range.

For example, to scale and translate the New Jersey State Plane projection to fit the center of a GeoJSON object `nj` within a 960×500 bounding box with 20-pixel padding:

```js
const projection = d3
  .geoTransverseMercator()
  .rotate([74 + 30 / 60, -38 - 50 / 60])
  .fitExtent(
    [
      [20, 20],
      [940, 480]
    ],
    nj
  );
```

When determining the new scale and translation, any clipping range is ignored. The precision for calculating the bounding box of the given object is calculated when the valid scale is 150.

- `fitSize`

Read the `size` configuration, then call the `fitSize` method provided by `d3`;
Sets the `fitExtent` shorthand, equivalent to `fitExtent([[0, 0], [width, height]], ...)`

{{ use: projections-function(returnType = 'boolean') }}

## size

Used in conjunction with the `fit` attribute to set `fitSize`; the value type is a two-dimensional array, i.e., `[width, height]`, in `px` units;

{{ use: projections-function(returnType = '[number, number]') }}

## clipAngle(number)

Sets the clipping circle radius of the projection to the specified angle (in degrees).
If the value is `null`, switch to meridian clipping instead of small circle clipping; small circle clipping is independent of the viewport clipping performed by `projection.clipExtent`.

{{ use: projections-function(returnType = 'number') }}

## clipExtent

Sets the **viewport clipping range** of the projection to the specified pixel boundary;
The type of `clipExtent` is: `[[x0, y0], [x1, y1]]`, where x0 is the left side of the viewport, y0 is the top, x1 is the right side, and y1 is the bottom, all in `px` units.
If the range is null, no viewport clipping is performed.
If not specified, the current viewport clipping range is returned, which defaults to null.
Viewport clipping is independent of the small circle clipping performed by `projection.clipAngle`.

{{ use: projections-function(returnType = '[[number, number], [number, number]]') }}

## scale(number)

Sets the scale of the projection, setting the projection scale factor to the specified value; different projection types have different default scale values.
Scales are linearly related to the distance between projection points; however, the absolute scale factor between different projections is not equivalent.

{{ use: projections-function(returnType = 'number') }}

## translate

Set the translation of the projection, unit is `px`, type is `[number, number]`, default value is `[480, 250]`;
This configuration determines the center of the projection. The default projection center is calculated based on an area of 960\*500, and the longitude and latitude is (0, 0).

{{ use: projections-function(returnType = '[number, number]') }}

## center

Set the center of the projection, unit is `deg`, type is `[number, number]`, which separately set the corresponding values of longitude and latitude. The default value is `[0, 0]`.

{{ use: projections-function(returnType = '[number, number]') }}

## rotate

Set the spherical rotation angle of the projection, unit is `deg`, type is `[number, number]` or `[number, number, number]`.
If the value is a two-dimensional array, it means the value of `rotate[2]` is `0`, with the default being [0, 0, 0].

{{ use: projections-function(returnType = '[number, number] | [number, number, number]') }}

## parallels

Two standard latitude lines defining the map layout in a conic projection with type `[number, number]`.

{{ use: projections-function(returnType = '[number, number]') }}

## precision(number)

Sets the adaptive resampling threshold of the projection to the specified pixel value; this value corresponds to the **Douglas-Peucker** distance; the default value is `Math.sqrt(0.5)`.

{{ use: projections-function(returnType = 'number') }}

## reflectX(boolean)

Sets whether the x dimension is reflected (inverted) in the output; useful in special scenarios where you need to view the sky from below or in some astronomical data scenarios; when the north direction points upward, the right ascension (east direction) will point to the left.

{{ use: projections-function(returnType = 'boolean') }}

## reflectY(boolean)

Sets whether the y dimension is reflected (inverted) in the output;

{{ use: projections-function(returnType = 'boolean') }}

## coefficient(number)=2

Applicable only to `type="hammer"` type of `projection`;

{{ use: projections-function(returnType = 'number') }}

## distance(number)=2

Applicable only to `type="satellite"` type of `projection`;

The distance from the viewpoint to the center of the sphere / radius of the sphere, default is 2.0. For a given distance, the recommended maximum clipping angle is `acos(1 / distance)` converted to degrees.
If tilt is also applied, more conservative clipping may be needed. For precise clipping, you need to use the geographic projection pipeline under development;

{{ use: projections-function(returnType = 'number') }}

## fraction(number)=0.5

Applicable only to `type="bottomley"` type of `projection`;

{{ use: projections-function(returnType = 'number') }}

## lobes(number)

Supported configuration only in the following types of projections:

- `'berghaus'` sets the number of lobes in the projection result; the default value is 5
- `'gingery'` sets the number of lobes in the projection result; the default value is 6
- `'healpix'` sets the number of lobes in the projection result; the default value is 4
- `'interrupted'` sets a new semi-lobe array

{{ use: projections-function(returnType = 'number') }}

## parallel(number)

Sets the latitude value; the projection types and default values that support this configuration are as follows:

- `'armadillo'` default value is 20
- `'bonne'` default value is 45
- `'craig'` default value is 0
- `'cylindricalEqualArea'` default value is 38.58
- `'cylindricalStereographic'` default value is 0
- `'hammerRetroazimuthal'` default value is 45
- `'loximuthal'` default value is 40
- `'rectangularPolyconic'` default value is 0

{{ use: projections-function(returnType = 'number') }}

## radius(number)

Sets the radius; the projection types and default values that support this configuration are as follows:

- `'gingery'` default value is 30
- `'airy'` default value is 90

{{ use: projections-function(returnType = 'number') }}

## ratio(number)

The projection types and default values that support this configuration are as follows:

- `'hill'` default value is 1
- `'wagner'` default value is 200
- `'hufnagel'`

{{ use: projections-function(returnType = 'number') }}

## spacing(number)

The projection types and default values that support this configuration are as follows:

- `'lagrange'` default value is 0.5

{{ use: projections-function(returnType = 'number') }}

## tilt(number)

The projection types and default values that support this configuration are as follows:

- `'satellite'` default value is 0

{{ use: projections-function(returnType = 'number') }}
