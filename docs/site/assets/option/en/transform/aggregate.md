{{ target: transform-aggregate }}

## transform.aggregate(Object)

### type(string) = 'aggregate'

Set the data transformation to `'aggregate'` to achieve data aggregation transformation, supporting the configuration of various aggregation types

### groupBy(Array)

Type: `string[]`. Group according to the declared field, supporting single field grouping or multiple field grouping.

### operations(Array) = ['count']

Type: `string[]`. Used to set the aggregation function corresponding to the type

{{ use: common-aggregateop() }}

When `ops` is not set, the default value is `['count']`, which means that the count aggregation operation will be performed by default.

### fields(Array)

- Type: `string[]`
- Required: No

Set the dimension fields corresponding to the aggregation calculation, which need to correspond to `ops` one by one.

### as(Array)

- Type: `string[]`
- Required: No

Set the field names corresponding to the aggregation calculation results, and the results will be set in the returned results through these fields. They need to correspond to `ops` and `fields` one by one. If not set, the default value will generate corresponding field names based on `${ops[index]}_${fields[index]}`.

### drop(boolean)

- Type: `boolean`
- Required: No

Whether to drop empty data

### cross(boolean)

Type: `boolean`
Required: No

Whether to fill in all elements after group-by cross multiplication

### key(string)

Set the globally unique key field, and the result corresponding to this field will be set in the returned result. If not set, a unique key will be created automatically based on the grouping field `groupBy` configuration.