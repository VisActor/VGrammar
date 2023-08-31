{{ target: transform-unfold }}

## transform.unfold(Object)

Implement filtering transformation on data

### type(string) = unfold

Set the transformation type to `unfold`

### groupBy

Type: `string[]`, group according to the declared fields, support single field grouping, and also support multiple field grouping

### field

Read the value of the corresponding field of the declared `field`, and use it as the key in the returned result

### value

Type: `string`

Read the value of the corresponding field of the declared `value`, and use it as the value in the returned result

### operation

Set the type of aggregation function

{{ use: common-aggregateop() }}

### limit(number) = 0

For the original data, after obtaining the unique key, return the first `limit` elements. If `limit` is 0, return all

### key(string)

Set a globally unique key field, the result corresponding to this field will be set to the returned result; if not set, a unique key will be automatically created based on the grouping field `groupBy` configuration