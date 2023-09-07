{{ target: transform-funnel }}

## transform.funnel(Object)

Used for calculating the `funnel` layout, implementing common funnel charts

### type(string) = funnel

Set the data transformation type to `funnel`, used for calculating the `funnel` layout, implementing common funnel charts

### field(string)

Set the corresponding data field

### asTransformRatio(string)

Set the field for storing **conversion rate (the ratio from thecurrent layer to the next layer)** data. If not set, the data corresponding to the conversion rate is not stored

### asReachRatio(string)

Set the field for storing **reach rate (the ratio from the previous layer to the current layer)** data. If not set, the data corresponding to the reach rate is not stored

### asHeightRatio(string)

The height axis accounts for the total proportion

### asValueRatio(string)

The ratio of the current value size

### asLastValueRatio(string)

The ratio of the previous layer value size

### asNextValueRatio(string)

The ratio of the next layer value size

### asCurrentValue(string)

The value of the current layer

### asLastValue(string)

The value of the previous layer

### asNextValue(string)

The value of the next layer

### isCone(boolean)

Whether the bottom layer of the funnel is cone-shaped

### heightVisual(boolean)

Whether the height is data-mapped

### range(object)

The value range, in the format of `{ min: number; max: number }`, set the maximum range of data to calculate the last layer's conversion rate related indicators