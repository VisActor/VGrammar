{{ target: scales-common-uservalue }}

<!-- Syntax elements data, DataSpec -->

#${prefix} zero(boolean)

For scale, calculate an original value range based on the data, which is the `domain`, and then update the value of `domain` in the following two cases:

- If the minimum value is greater than `0`, set the minimum value of `domain` to `0`
- If the maximum value is less than `0`, set the maximum value of `domain` to `0`

When the user is very concerned about the base value of `0`, it can be set to `true`, with the default value being `false`.

#${prefix} min(number)

Calculate an original value range based on the data, which is the `domain`. If the minimum value is greater than the user-configured `min`, set the minimum value of `domain` to `min`.

#${prefix} max(number)

Calculate an original value range based on the data, which is the `domain`. If the maximum value is greater than the user-configured `max`, set the maximum value of `domain` to `max`.