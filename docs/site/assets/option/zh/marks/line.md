{{ target: marks-line }}

<!-- 图元 line -->

线图元

# marks.line(Object)

** 线图元 ** 测试一下

## type(string) = 'line'

设置为线图元类型

## enableSegments(boolean)

是否开启分段样式；因为分段样式解析需要一定的性能消耗，所以仅在开了了该功能的时候，会检测所有的点对应的样式不一样的时候，自动开启分段样式

{{ use: marks-encode(type = 'line', prefix = '#') }}

{{ use: marks-animate(type = 'line') }}

{{ use: marks-base( prefix = '#' ) }}
{{ use: marks-common-large( prefix = '#' ) }}
{{ use: marks-common-morph( prefix = '#' ) }}
