{{target: marks-line}}

<!-- Graphic element line -->

Line graphic element

# marks.line(Object)

** Line graphic element ** Test it out

## type(string) = 'line'

Set to line graphic element type


## enableSegments(boolean)

Whether to enable segmented style; because parsing segmented style requires a certain performance cost, it will only be automatically enabled when the feature is turned on, and all points correspond to different styles.


{{ use: marks-encode(type = 'line', prefix = '#') }}

{{ use: marks-animate(type = 'line') }}

{{ use: marks-base( prefix = '#' ) }}
{{ use: marks-common-large( prefix = '#' ) }}
{{ use: marks-common-morph( prefix = '#' ) }}
