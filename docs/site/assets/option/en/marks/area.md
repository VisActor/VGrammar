{{ target: marks-area }}

# marks.area(Object)

** area mark **

## type(string) = 'area'

Set the mark type to `area`


## enableSegments(boolean)

Whether to enable segmented style; because parsing segmented style requires a certain performance cost, it will only be automatically enabled when the feature is turned on, and all points correspond to different styles.

{{ use: marks-encode(type = 'area', prefix = '#') }}

{{ use: marks-animate(type = 'area') }}

{{ use: marks-base( prefix = '#' ) }}
{{ use: marks-common-large( prefix = '#' ) }}
{{ use: marks-common-morph( prefix = '#' ) }}