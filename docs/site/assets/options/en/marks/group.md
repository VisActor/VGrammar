{{ target: marks-group }}

# marks.group(Object)

** group Mark **

## type(string) = 'group'

Set the mark type to `group`

## clip(boolean)=false

Whether the `group` mark clips its child marks

{{ use: marks-encode(type = 'group', prefix = '#') }}
{{ use: marks-animate(type = 'group') }}
{{ use: marks-base( prefix = '#' ) }}
{{ use: marks-common-large( prefix = '#' ) }}
{{ use: marks-common-morph( prefix = '#' ) }}