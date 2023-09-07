{{ target: common-padding }}

The inner padding of ${componentName}, in px unit, with the default padding of 0 for all directions. Accepts numerical values, numerical arrays, and objects for settings.

Example of usage:

```ts
// Numerical type, set the padding to 5
padding: 5;
// Numerical array, set the top and bottom padding to 5, and the left and right padding to 10, similar to the CSS box model
padding: [5, 10];
// Numerical array, set the padding for all four directions separately
padding: [
  5, // Top
  10, // Right
  5, // Bottom
  10 // Left
];
// Object type
padding: {
  top: 5,
  right: 10,
  bottom: 5,
  left: 10
}
```
