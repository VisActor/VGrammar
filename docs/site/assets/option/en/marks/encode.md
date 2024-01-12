{{ target: marks-encode }}

#${prefix} encode

Set the visual channel encoding for the graphic element, supporting three default data change states:

- `enter` Add data elements
- `update` Data element updates
- `exit` Data elements are deleted

Note that the data states here are automatically generated based on the `mark`'s `key`. We will calculate a unique identifier for the bound data based on the `key` configuration. After data updates, if the corresponding unique identifier no longer exists, the state is `exit`; if it exists, it is `update`. If the previous data does not have this unique identifier, the data element's state is `enter`.

Supports a default grouping visual encoding, which will only be executed once for each group:

- `group` Executes visual encoding for each group of graphic elements that have `groupBy` set

##${prefix} enter

Set the visual channel mapping for the graphic element in the data initialization state, note that it will not be executed during data updates

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

##${prefix} update

Set the visual channel mapping for the graphic element in the data update state

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

##${prefix} exit

Set the visual channel mapping for the graphic element in the state where data is deleted

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

##${prefix} group

Set the visual encoding corresponding to the group, the visual channel mapping for the graphic element

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

{{ if: ${type} === 'line' || ${type} === 'area' }}

##${prefix} connectNulls

For `line` and `area` graphic elements, set the visual channel for connecting missing points

{{ use: marks-common-channels(
  prefix = '##' + ${prefix},
  type = ${type}
) }}

{{ /if }}
```
