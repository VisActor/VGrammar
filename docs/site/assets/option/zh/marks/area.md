{{ target: marks-area }}

# marks.area(Object)

** area 图元 **

## type(string) = 'area'

设置图元类型为 `area`

## enableSegments(boolean)

是否开启分段样式；因为分段样式解析需要一定的性能消耗，所以仅在开了了该功能的时候，会检测所有的点对应的样式不一样的时候，自动开启分段样式

{{ use: marks-encode(type = 'area', prefix = '#') }}

{{ use: marks-animate(type = 'area') }}

{{ use: marks-base( prefix = '#' ) }}
{{ use: marks-common-large( prefix = '#' ) }}
{{ use: marks-common-morph( prefix = '#' ) }}
