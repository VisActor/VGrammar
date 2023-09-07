{{target: transform-pie}}

## transform.pie(Object)

Used to calculate the `pie` layout, implementing common pie charts

### type(string) = pie

Set the type of data transformation to `pie`, used to calculate the `pie` layout, implementing common pie charts

### field(string)

The field corresponding to the proportion in the pie chart

### startAngle(number)

Starting angle, can be omitted, default value is `0`

### endAngle(number)

End angle, can be omitted, default value is `2 * Math.PI`

### asStartAngle(string)

Set the field to store the **starting angle** data of each sector. If not set, the corresponding starting angle data will not be stored

### asEndAngle(string)

Set the field to store the **end angle** data of each sector. If not set, the corresponding end angle data will not be stored

### asMiddleAngle(string)

Set the field to store the **middle angle** data of each sector. If not set, the corresponding middle angle data will not be stored

### asRadian(string)

Set the field to store the **radian value** data of each sector. If not set, the corresponding radian data will not be stored

### asRatio(string)

Set the field to store the **proportion** data of each sector. If not set, the corresponding proportion data will not be stored

### asQuadrant(string)

Calculate the quadrant where the end angle of each sector is located and save the result to the specified field. If not set, the corresponding quadrant data will not be stored

### asK(string)

Calculate the ratio of data corresponding to each sector to the maximum value and save the result to the specified field. If not set, the corresponding ratio data will not be stored
