{{ target: marks-group }}

# marks.group(Object)

** group 图元 **

## type(string) = 'group'

设置图元类型为 `group`

## clip(boolean)=false

`group`图元是否对子图元进行剪切操作

{{ use: marks-encode(type = 'group', prefix = '#') }}
{{ use: marks-animate(type = 'group') }}
{{ use: marks-base( prefix = '#' ) }}
{{ use: marks-common-large( prefix = '#' ) }}
{{ use: marks-common-morph( prefix = '#' ) }}
