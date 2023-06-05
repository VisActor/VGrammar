import type { GrammarSpec, IGrammarBase } from './grammar';
import type { Vector2, Vector3 } from './base';
import type { GenericFunctionType } from './signal';

export type GeoJsonFeatureSpec = any; // TODO
export type GeoJsonFeatureCollectionSpec = any; // TODO
export type FitSpec = GeoJsonFeatureSpec | GeoJsonFeatureCollectionSpec | GeoJsonFeatureSpec[];
export type ProjectionType =
  | 'albers'
  | 'albersUsa'
  | 'azimuthalEqualArea'
  | 'azimuthalEquidistant'
  | 'conicConformal'
  | 'conicEqualArea'
  | 'conicEquidistant'
  | 'equalEarth'
  | 'equirectangular'
  | 'gnomonic'
  | 'identity'
  | 'mercator'
  | 'naturalEarth1'
  | 'orthographic'
  | 'stereographic'
  | 'transverseMercator';

export type ProjectionFunctionCallback<T> = (projection: IGrammarBase, parameters: any) => T;

export type ProjectionFunctionType<T> = GenericFunctionType<ProjectionFunctionCallback<T>, T>;
export interface BaseProjectionSpec extends GrammarSpec {
  /*
   * The cartographic projection to use. This value is case-insensitive, for example `"albers"` and `"Albers"` indicate the same projection type.
   *
   * __Default value:__ `mercator`
   */
  type?: ProjectionType | ProjectionFunctionType<ProjectionType>;

  /**
   * The projection's clipping circle radius to the specified angle in degrees. If `null`, switches to [antimeridian](http://bl.ocks.org/mbostock/3788999) cutting rather than small-circle clipping.
   */
  clipAngle?: number | ProjectionFunctionType<number>;

  /**
   * The projection's viewport clip extent to the specified bounds in pixels. The extent bounds are specified as an array `[[x0, y0], [x1, y1]]`, where `x0` is the left-side of the viewport, `y0` is the top, `x1` is the right and `y1` is the bottom. If `null`, no viewport clipping is performed.
   */
  clipExtent?: Vector2<number> | ProjectionFunctionType<Vector2<number>>;

  /**
   * The projection’s scale factor. The default scale is projection-specific. The scale factor corresponds linearly to the distance between projected points; however, scale factor values are not equivalent across projections.
   */
  scale?: number | ProjectionFunctionType<number>;

  /*
   * The projection's translation offset as a two-element array `[tx, ty]`, defaults to `[480, 250]`. The translation offset determines the pixel coordinates of the projection's center. The default translation offset places (0°,0°) at the center of a 960×500 area.
   */
  translate?: Vector2<number> | ProjectionFunctionType<Vector2<number>>;

  /**
   * The projection's center, a two-element array of longitude and latitude in degrees.
   *
   * __Default value:__ `[0, 0]`
   */
  center?: Vector2<number> | ProjectionFunctionType<Vector2<number>>;
  /**
   * The projection's three-axis rotation to the specified angles, which must be a two- or three-element array of numbers [`lambda`, `phi`, `gamma`] specifying the rotation angles in degrees about each spherical axis. (These correspond to yaw, pitch and roll.)
   *
   * __Default value:__ `[0, 0, 0]`
   */
  rotate?:
    | Vector2<number>
    | ProjectionFunctionType<Vector2<number>>
    | Vector3<number>
    | ProjectionFunctionType<Vector3<number>>;

  /**
   * For conic projections, the [two standard parallels](https://en.wikipedia.org/wiki/Map_projection#Conic) that define the map layout. The default depends on the specific conic projection used.
   */
  parallels?: number[] | ProjectionFunctionType<number[]>;

  /**
   * The default radius (in pixels) to use when drawing GeoJSON `Point` and `MultiPoint` geometries. This parameter sets a constant default value. To modify the point radius in response to data, see the corresponding parameter of the GeoPath and GeoShape transforms.
   *
   * __Default value:__ `4.5`
   */
  pointRadius?: number | ProjectionFunctionType<number>;

  /**
   * The threshold for the projection's [adaptive resampling](http://bl.ocks.org/mbostock/3795544) to the specified value in pixels. This value corresponds to the [Douglas–Peucker distance](http://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm). If precision is not specified, returns the projection's current resampling precision which defaults to `√0.5 ≅ 0.70710…`.
   */
  precision?: number | ProjectionFunctionType<number>;

  /*
   * GeoJSON data to which the projection should attempt to automatically fit the `translate` and `scale` parameters. If object-valued, this parameter should be a GeoJSON Feature or FeatureCollection. If array-valued, each array member may be a GeoJSON Feature, FeatureCollection, or a sub-array of GeoJSON Features.
   */
  fit?: FitSpec | FitSpec[] | ProjectionFunctionType<FitSpec>;
  /*
   * Used in conjunction with fit, provides the pixel area to which the projection should be automatically fit.
   */
  extent?: Vector2<number> | ProjectionFunctionType<Vector2<number>>;
  /*
   * Used in conjunction with fit, provides the width and height in pixels of the area to which the projection should be automatically fit.
   */
  size?: Vector2<number> | ProjectionFunctionType<Vector2<number>>;

  // TODO: use a union tagged by the projection type to determine which of the following is applicable
  /* The following properties are all supported for specific types of projections. Consult the d3-geo-projection library for more information: https://github.com/d3/d3-geo-projection */
  coefficient?: number | ProjectionFunctionType<number>;
  distance?: number | ProjectionFunctionType<number>;
  fraction?: number | ProjectionFunctionType<number>;
  lobes?: number | ProjectionFunctionType<number>;
  parallel?: number | ProjectionFunctionType<number>;
  radius?: number | ProjectionFunctionType<number>;
  ratio?: number | ProjectionFunctionType<number>;
  spacing?: number | ProjectionFunctionType<number>;
  tilt?: number | ProjectionFunctionType<number>;

  /*
   * Sets whether or not the x-dimension is reflected (negated) in the output.
   */
  reflectX?: boolean | ProjectionFunctionType<boolean>;

  /*
   * Sets whether or not the y-dimension is reflected (negated) in the output.
   */
  reflectY?: boolean | ProjectionFunctionType<boolean>;
}
export interface ProjectionSpec extends BaseProjectionSpec {
  /*
   * The name of the projection.
   */
  name: string;
}
