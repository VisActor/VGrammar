{{ target: marks-animate }}

##${prefix} animationState

Type: `MarkFunctionType`
Required: No
animation attributes

##${prefix} animation

Supports setting various state corresponding animations, data-driven animation states have three types:

- `enter`
- `update`
- `exit`

Interaction-triggered state changes are configured through a unified interaction animation, with the configuration key being `state`

###${prefix} type

Animation execution type, specifying a specific built-in animation execution effect

Universal built-in animation types include:

- `fadeIn`/`fadeOut`: Fade in and out animations
- `scaleIn`/`scaleOut`: Scaling animations
- `moveIn`/`moveOut`: Move in and out animations
- `rotateIn`/`rotateOut`: Rotation animations
- `update`: Update animations

{{ if: ${type} === 'rect' }}

${type} primitive additional supported animation types include:

- `growHeightIn`/`growHeightOut`: Height growing animation
- `growWidthIn`/`growWidthOut`: Width growing animation
- `growCenterIn`/`growCenterOut`: Center growing animation

{{ elif: ${type} === 'arc' }}

${type} primitive additional supported animation types include:

- `growRadiusIn`/`growRadiusOut`: Radius growing animation
- `growAngleIn`/`growAngleOut`: Angle growing animation

{{ elif: ${type} === 'line' | ${type} === 'area' }}

${type} primitive additional supported animation types include:

- `growPointsIn`/`growPointsOut`: Point growing animation
- `growPointsXIn`/`growPointsXOut`: X direction point growing animation
- `growPointsYIn`/`growPointsYOut`: Y direction point growing animation
- `clipIn`/`clipOut`: Clipping animation

{{ elif: ${type} === 'interval' }}

${type} primitive additional supported animation types include:

- `growIntervalIn`/`growIntervalOut`: Growing animation

{{ elif: ${type} === 'polygon' }}

${type} primitive additional supported animation types include:

- `growPointsIn`/`growPointsOut`: Point growing animation

{{ /if }}

###${prefix} channel(object|array)

Visual channels before and after the animation is executed, conflicts with `type` configuration

###${prefix} custom(ACustomAnimate)

Custom animation, if custom animation configuration is set, it will replace the default visual channel interpolation logic

###${prefix} customParameters

Custom animation parameters

###${prefix} easing(string|EasingTypeFunc)

Animation easing, default is `'quintInOut'`

###${prefix} delay(number)

Animation execution delay time, default is 0

###${prefix} duration(number)

Animation execution duration, default is 1000ms

###${prefix} oneByOne(number|boolean)

Animation execution delay time in sequence. If set to `true`, the next element's animation will be executed after the previous element's animation is completed. The default is `false`.

###${prefix} startTime(number)

Initial time of animation execution, which will not be repeatedly applied in loop animation, default is 0

###${prefix} totalTime(number)

Maximum time of animation execution, the animation will be terminated if it reaches the set time

###${prefix} loop(number|boolean)

Number of animation loops, if set to `true`, it will loop infinitely

###${prefix} options

Additional parameters set for specific animation types execution

###${prefix} controlOptions

Control parameters for animation execution logic:

- `stopWhenStateChange`: Whether to immediately terminate its animation when the animation state changes
- `immediatelyApply`: Whether to immediately apply the initial visual channel of the animation