{{target: transform-stack}}

## transform.stack(Object)

Perform data stacking for displaying stacked bar charts, stacked area charts, percentage area charts, and more.

### type(string) = stack

Set the data transformation type to `stack` for calculating stacked data.

### orient(string) = 'positive'

Optional values: 'positive' | 'negative';

Set the direction of the stacking calculation. If the value is `negative`, the raw data will be processed in reverse order before stacking.

### stackField(string)

Set the stacking field, corresponding value should be of numeric type.

### dimensionField(string)

Set the dimension field, corresponding value is generally of string type, used to represent the categorical field.

### asStack(string)

Set the field to save the stacked data after calculation. If not set, it will be saved by default in the stackField declared field.

### asPrevStack(string)

For each categorical value, set the corresponding previous step's stacking value. If not set, it will not be recorded.

### asPercent(string)

Set the percentage for each categorical value. If not set, it will not be recorded.

### asPercentStack(string)

Set the percentage value after stacking calculation. If not set, it will not be recorded.

### asPrevPercentStack(string)

Set the previous step's corresponding stacking percentage value. If not set, it will not be recorded.

### asSum(string)

Set the sum for each categorical value. If not set, it will not be recorded.
