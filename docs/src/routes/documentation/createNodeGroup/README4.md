
### `Transition Objects`

You can return a single transition object or an array of transition objects in your **onEnter**, **onUpdate** and **onExit** methods.
Each object can specify its own timing and events.

There's two special keys:  **timing** and **events**.  You don't want to use those in your state.
The rest of the keys in the transition object are assumed to be keys in your state.
For each key you want to transition you can send four different types of values to specify how you want to transform the state.

### Explanation of each type:

* `string or number`: Set the value immediately with no transition.

* `array [value]`: Transition from the current value to the specified value.

* `array [value, value]`: Transition from the first value to the second value.

* `function`: Function will be used as a custom tween function.

Example transition objects:
```js
onUpdate = () => ([  // An array!!
  {
    opacity: [0.6],
    fill: ['blue', 'grey'],
    timing: { duration: 2000 },
  },
  {
    x: [this.props.xScale(this.props.data.name)],
    timing: { duration: 2000, ease: easeBounce },
  },
  {
    width: [this.props.xScale.bandwidth()],
    timing: { duration: 500 },
  },
  {
    height: [this.props.yScale(this.props.data.value)],
    timing: { delay: 2000, duration: 500 },
    events: { // events!!
      end: () => {
        this.setState({ fill: 'steelblue' });
      },
    },
  },
])

onExit = () => ({
  opacity: [1e-6],
  fill: 'red',
  timing: { duration: 1000 },
  events: { end: this.props.remove },
})
```

### `Interpolators`

Interpolators are inferred from what you specify in your transition object.

You can name the keys that are transitioning whatever you want, but if you use the key "transform" it will indicate that you want to use D3's SVG transform interpolator.
Beyond that, the value will determine the interpolator.  This is, essentailly, how D3 picks interpolators.

The logic is as follows:
1. If the value is a function, it will be used as a custom tween function.
2. The key and value are passed to the function below:

```js
import {
  interpolateRgb,
  interpolateNumber,
  interpolateString,
  interpolateTransformSvg,
} from 'd3-interpolate';
import { color } from 'd3-color';

export function getInterpolator(key, value) {
  if (key === 'transform') {
    return interpolateTransformSvg;
  } else if (typeof value === 'number') {
    return interpolateNumber;
  } else if (value instanceof color || color(value) !== null) {
    return interpolateRgb;
  }

  return interpolateString;
}
```
