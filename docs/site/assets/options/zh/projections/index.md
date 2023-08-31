{{ target: projections-index }}

# projections(Array)

地图投影方法，文档可以参考:

- [d3-geo](https://github.com/d3/d3-geo)
- [d3-geo-projection](https://github.com/d3/d3-geo-projection#geoHammer)

<!-- 语法元素 pickion -->

{{ use: common-grammar(
    prefix = '#',
    grammarType = 'pickion'
) }}

## type(string)

设置投影变换的类型；
支持的类型有：

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

如果指定了`pointRadius`，将`Point`和 `MultiPoint`之间的半径设置为指定的数值。
如果没有指定`pointRadius`，则返回默认值 4.5。
一般而言，`pontRadius`为数值类型的常数，但也可以指定为一个自定义函数。
例如，如果您的 GeoJSON 数据具有其他属性，您可以在半径函数内访问这些属性以改变点的大小。

{{ use: projections-function(returnType = 'number') }}

## extent

将投影的 viewPort 设置为指定的像素边界。
`extent`的类型为：`[[x0，y0]，[x1，y1]]`，其中 x0 是视口的左侧，y0 是顶部，x1 是右侧，y1 是底部，单位都是`px`。
如果范围为 null，则不执行视口剪裁。
如果未指定范围，则返回当前视口剪裁范围，默认为 null。
视口剪裁与通过 `projection.clipAngle` 进行的小圆剪裁是独立的。

{{ use: projections-function(returnType = '[[number, number], [number, number]]') }}

## fit(boolean)

是否自适应调整策略，如果值为`true`，则自适应调整策略。支持两种类型的自适应策略:

- `fitExtent`

读取`extent`配置，然后调用`d3`提供的`fitExtent`方法；将投影的比例尺（scale）和平移（translate）设置为适应给定范围内的指定 GeoJSON 对象的中心。

例如，要将新泽西州平面投影（New Jersey State Plane projection）按比例缩放和平移以适应一个带有 20 像素填充的 960×500 边界框中的 GeoJSON 对象 nj 的中心：

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

在确定新的比例尺和平移时，任何剪裁范围都会被忽略。用于计算给定对象的边界框的精度在有效比例尺为 150 时计算。

- `fitSize`

读取`size`配置，然后调用`d3`提供的`fitSize`方法；
设置`fitExtent`的快捷方式，等同于`fitExtent([[0, 0], [width, height]], ...)`

{{ use: projections-function(returnType = 'boolean') }}

## size

配合属性`fit` 共同设置`fitSize`；值的类型为二维数组，即`[width, height]`，单位为`px`;

{{ use: projections-function(returnType = '[number, number]') }}

## clipAngle(number)

投影的裁剪圆半径设置为指定的角度（以度为单位）。
如果值为`null`，则切换到经线裁剪而不是小圆裁剪；小圆裁剪与通过 `projection.clipExtent` 进行的视口裁剪是相互独立的。

{{ use: projections-function(returnType = 'number') }}

## clipExtent

将投影的 **视口裁剪范围设置** 设置为指定的像素边界；
`clipExtent`的类型为：`[[x0，y0]，[x1，y1]]`，其中 x0 是视口的左侧，y0 是顶部，x1 是右侧，y1 是底部，单位都是`px`。
如果范围为 null，则不执行视口剪裁。
如果未指定范围，则返回当前视口剪裁范围，默认为 null。
视口剪裁与通过 `projection.clipAngle` 进行的小圆剪裁是独立的。

{{ use: projections-function(returnType = '[[number, number], [number, number]]') }}

## scale(number)

设置投影的比例尺，则将投影的比例因子设置为指定的值；不同投影类型，默认的比例尺对应的值不一样。
比例尺与投影点之间的距离成线性关系；然而，不同投影之间的绝对比例因子并不等同

{{ use: projections-function(returnType = 'number') }}

## translate

设置投影的平移量，单位为`px`，类型为`[number, number]`，默认值为`[480, 250]`；
这个配置决定了投影的中心点，默认的投影中心点为是根据大小为 960\*500 的一个区域，计算经纬度为(0, 0)的点得到的值

{{ use: projections-function(returnType = '[number, number]') }}

## center

设置投影的中心点，单位为`deg`，类型为`[number, number]`，分别设置经纬度对应的值，默认值为`[0, 0]`

{{ use: projections-function(returnType = '[number, number]') }}

## rotate

设置投影的球面旋转角度，单位为`deg`，类型为`[number, number]` 或者`[number, number, number]`；
如果值为二维数组，则表示`rotate[2]`的值为`0`，默认为[0, 0, 0]

{{ use: projections-function(returnType = '[number, number] | [number, number, number]') }}

## parallels

锥形投影中定义地图布局的两个标准纬线，类型为`[number, number]`

{{ use: projections-function(returnType = '[number, number]') }}

## precision(number)

将投影的自适应重采样的阈值设置为指定的像素值；该值对应于**Douglas–Peucker**距离；默认值为`Math.sqrt(0.5)`

{{ use: projections-function(returnType = 'number') }}

## reflectX(boolean)

设置输出中是否反射（取反）x 维度；特殊场景下，需要从下方看到天空，或者某些天文数据场景，比较有用：当北方指向上方时，赤经（东方方向）将指向左侧。

{{ use: projections-function(returnType = 'boolean') }}

## reflectY(boolean)

设置输出中是否反射（取反）y 维度；

{{ use: projections-function(returnType = 'boolean') }}

## coefficient(number)=2

仅适用于`type="hammer"`类型的`projection`;

{{ use: projections-function(returnType = 'number') }}

## distance(number)=2

仅适用于`type="satellite"` 类型的`projection`；

视角点到球体中心的距离 / 球体半径，默认为 2.0。对于给定的距离，建议的最大裁剪角度为`acos(1 / distance)`转换为度数。
如果还应用了倾斜，则可能需要更保守的裁剪。要进行精确裁剪，需要使用正在开发中的地理投影流水线；

{{ use: projections-function(returnType = 'number') }}

## fraction(number)=0.5

仅适用于`type="bottomley"` 类型的`projection`；

{{ use: projections-function(returnType = 'number') }}

## lobes(number)

仅在以下几个类型的投影中，支持配置

- `'berghaus'` 设置投影结果中，星形图的叶数；默认值为 5
- `'gingery'` 设置投影结果中，星形图的叶数；默认值为 6
- `'healpix'` 设置投影结果的叶数，默认值为 4
- `'interrupted'` 设置新的半叶数组

{{ use: projections-function(returnType = 'number') }}

## parallel(number)

设置纬线值；支持该配置的投影类型和默认值如下：

- `'armadillo'` 默认值为 20
- `'bonne'` 默认值为 45
- `'craig'` 默认值为 0
- `'cylindricalEqualArea'` 默认值为 38.58
- `'cylindricalStereographic'` 默认值为 0
- `'hammerRetroazimuthal'` 默认值为 45
- `'loximuthal'` 默认值为 40
- `'rectangularPolyconic'` 默认值为 0

{{ use: projections-function(returnType = 'number') }}

## radius(number)

设置半径；支持该配置的投影类型和默认值如下：

- `'gingery'` 默认值为 30
- `'airy'` 默认值为 90

{{ use: projections-function(returnType = 'number') }}

## ratio(number)

支持该配置的投影类型和默认值如下：

- `'hill'` 默认值为 1
- `'wagner'` 默认值为 200
- `'hufnagel'`

{{ use: projections-function(returnType = 'number') }}

## spacing(number)

支持该配置的投影类型和默认值如下：

- `'lagrange'` 默认值为 0.5

{{ use: projections-function(returnType = 'number') }}

## tilt(number)

支持该配置的投影类型和默认值如下：

- `'satellite'` 默认值为 0

{{ use: projections-function(returnType = 'number') }}
