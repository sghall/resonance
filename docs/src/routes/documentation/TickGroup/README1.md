### `Transition Objects`

The TickGroup in Resonance is different than other transition group components ([react-transition-group](https://github.com/reactjs/react-transition-group), [react-motion](https://github.com/chenglou/react-motion), etc) because you use objects to express how you want your state to transition as the tick enters, updates and leaves.
You can return a single object or an array of objects in your **enter**, **update** and **leave** functions.
Each object can specify its own timing and events idependently.

Inside your object there's two special keys:  **timing** and **events**.  You don't want to use those in your state.
The rest of the keys in the transition object are assumed to be keys in your state.
For each key you want to transition you can send four different types of values to specify how you want to transform the state.

### Explanation of each type:

* `string or number`: Set the value immediately with no transition.

* `array [value]`: Transition from the current value to the specified value.

* `array [value, value]`: Transition from the first value to the second value.

* `function`: Function will be used as a custom tween function.

Example transition objects:
```js
start={(tick) => ({
  opacity: 1e-6,
  transform: `translate(${xScale(tick.val)},0)`,
})}

enter={(tick, index, cached) => ({
  opacity: [1e-6, 1],
  transform: [
    `translate(${cached(tick.val)},0)`,
    `translate(${xScale(tick.val)},0)`,
  ],
  timing: { duration, ease: easeExp },
})}

update={(tick) => ({
  opacity: [1],
  transform: [`translate(${xScale(tick.val)},0)`],
  timing: { duration, ease: easeExp },
})}

leave={(tick, index, cached, remove, lazyRemove) => ({
  opacity: [1e-6],
  transform: [`translate(${xScale(tick.val)},0)`],
  timing: { duration, ease: easeExp },
  events: { end: lazyRemove },
})}
```

### `Interpolators`

Interpolators are inferred from what you specify in your transition object.

You can name the keys that are transitioning whatever you want, but if you use the key "transform" it will indicate that you want to use D3's SVG transform interpolator.
Beyond that, the value will determine the interpolator.  This is, essentailly, how D3 picks interpolators.

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

### `Removing Ticks`

Because you can pass arrays of objects describing state transitions, all with independent duration, events and delays it's impossible to automatically remove the node.
You have to specify that.
You are passed a remove function in your **leave** function that simply needs to be invoked (no parameters) to release the node at the end of the transition.
The API tracks closely with how [D3](https://github.com/d3/d3-selection) works.

This provides a lot of control and also helps with quickly debugging transitions.
For example, it's much easier to make sure your nodes "recover" correctly if they are interrupted on an exit transition.
Just comment out the remove line and run your transitions.
Nodes that would have been removed are now "updating" and you can simulate what would happen if a transition were interrupted just before they left the document.

**Example usage of remove function for a node:** 
```js
leave={(node, index, remove) => ({
  opacity: [1e-6],
  fill: 'red',
  timing: { duration: 1000 },
  events: { end: remove },
})}
```

**Or if you have no leave transition:**
```js
leave={(node, index, remove) => {
  remove();
}}
```


