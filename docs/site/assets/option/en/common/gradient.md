{{ target: common-gradient }}

Gradient color configuration. Gradient colors can be configured on color-supporting properties such as `fill` and `stroke` in graphic styles. Currently supports three gradient configurations:

- Linear gradient

```ts
// Linear gradient, the first four parameters are x0, y0, x1, y1, ranging from 0 to 1, which is equivalent to the percentage within the bounding box of the graphic
{
  gradient: 'linear',
  x0: 0,
  y0: 0,
  x1: 0,
  y1: 1,
  stops: [
    {
      offset: 0,
      color: 'red' // Color at 0%
    },
    {
      offset: 1,
      color: 'blue' // Color at 100%
    }
  ],
}
```

- Radial gradient

```ts
// Radial gradient, the first five parameters are x0, y0, r0, x1, y1, r1, where r0 and r1 represent radius, values are the same as linear gradient
{
  gradient: 'radial',
  x0: 0.5,
  y0: 0,
  r0: 0,
  x1: 0.5,
  y1: 1,
  r1: 0.7,
  stops: [
    {
      offset: 0,
      color: 'rgba(255,255,255,0.5)' // Color at 0%
    },
    {
      offset: 1,
      color: '#6690F2' // Color at 100%
    }
  ]
}
```

- Conical gradient

```ts
// Conical gradient, startAngle represents starting radian, endAngle represents ending radian, x and y are coordinates, and the value range is 0 - 1
{
  gradient: 'conical',
  x: 0.5,
  y: 0.5,
  startAngle: 0,
  endAngle: 6.283185307179586,
  stops: [
    { offset: 0, color: 'red' },      // Color at 0%
    { offset: 0.2, color: 'blue' },   // Color at 20%
    { offset: 0.4, color: 'orange' }, // Color at 40%
    { offset: 0.6, color: 'pink' },   // Color at 60%
    { offset: 0.8, color: 'green' },  // Color at 80%
    { offset: 1, color: 'purple' }    // Color at 100%
  ],
}
```
