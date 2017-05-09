### Transition Objects

You can return a single object or an array of objects in your **enter**, **update** and **leave** functions.
Each object can specify its own timing and events independently.

Inside your object there's two reserved keys:  **timing** and **events**.  Both are optional.
The rest of the keys in the transition object are assumed to be keys in your state.
For each key you want to transition you can send four different types of values to specify how you want to transform the state.

***Example transition objects:***
```js
update={(data) => ([  // An array!!
  {
    opacity: [0.6],
    fill: ['blue', 'grey'],
    timing: { duration: 2000 },
  },
  {
    x: [xScale(data.name)],
    timing: { duration: 2000, ease: easeExpInOut },
  },
  {
    width: [xScale.bandwidth()],
    timing: { duration: 500 },
  },
  {
    height: [yScale(data.value)],
    timing: { delay: 2000, duration: 500 },
    events: { // Events!!
      end() {
        this.setState({ fill: 'steelblue' });
      },
    },
  },
])}
```

***Explanation of each type:***

* `string or number`: Set the value immediately with no transition.

* `array [value]`: Transition from the current value to the specified value.

* `array [value, value]`: Transition from the first value to the second value.

* `function`: Function will be used as a custom tween function.

***Default timing:***

If there's no timing key in your object you'll get the timing defaults:

```js
const defaultTming = {
  delay: 0,
  duration: 250,
  ease: easeCubicInOut,
};
```
You can specify just the things you want to override on your timing key.

### Interpolators

Interpolators are inferred from what you specify in your transition object.

With the exceptions of "events" and "timing" you can name the keys that are transitioning whatever you want, but if you use the key "transform" it indicates that you want to use D3's SVG transform interpolator.
Beyond that, the value will determine the interpolator.  This is essentailly how D3 picks interpolators.

The logic is as follows:
1. If the value is a function, it will be used as a custom tween function.
2. Then the key and value are passed to the function below:

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

### `Removing Nodes`

Because you can pass arrays of objects describing state transitions, all with independent duration, events and delays it's impossible to automatically remove the node.
You are passed a remove function in your **leave** function that simply needs to be invoked (no parameters) to release the node at the end of the transition.
The API tracks closely with how [D3](https://github.com/d3/d3-selection) works.

This provides a lot of control and also helps with quickly debugging transitions.
For example, it's much easier to make sure your nodes "recover" correctly if they are interrupted on a leave transition.
Just comment out the remove line and run your transitions.
Nodes that would have been removed are now "updating" and you can simulate what would happen if a transition were interrupted just before they left the document.

**Example usage of remove function for a node:** 
```js
leave={(data, index, remove) => ({
  opacity: [1e-6],
  fill: 'red',
  timing: { duration: 1000 },
  events: { end: remove },
})}
```

**Or if you have no leave transition:**
```js
leave={(data, index, remove) => {
  remove();
}}
```
