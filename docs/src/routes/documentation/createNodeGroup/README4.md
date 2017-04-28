Here's the complete circle component from the example above:
```js
class Circle extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    scale: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    remove: PropTypes.func.isRequired,
  }

  state = {
    g: {
      opacity: 1e-6,
      transform: 'translate(0,0)',
    },
    circle: {
      r: 1e-6,
      strokeWidth: 1e-6,
      fill: 'green',
    },
  }

  onEnter() {
    const { data: { name }, scale } = this.props;

    return {
      g: {
        opacity: [0.4],
        transform: [`translate(${scale(name) + (scale.bandwidth() / 2)},0)`],
      },
      circle: {
        r: [this.props.scale.bandwidth() / 2],
        strokeWidth: [(this.props.index + 1) * 2],
        fill: 'green',
      },
      timing: { duration: 1000, ease: easeExpInOut },
    };
  }

  onUpdate() {
    const { scale, index, data: { name } } = this.props;

    return {
      g: {
        opacity: [0.4],
        transform: [`translate(${scale(name) + (scale.bandwidth() / 2)},0)`],
      },
      circle: {
        r: [this.props.scale.bandwidth() / 2],
        strokeWidth: [(index + 1) * 2],
        fill: 'blue',
      },
      timing: { duration: 1000, ease: easeExpInOut },
    };
  }

  onExit = () => ({
    g: {
      opacity: [1e-6],
    },
    circle: {
      fill: 'red',
    },
    timing: { duration: 1000, ease: easeExpInOut },
    events: { end: this.props.remove },
  })

  render() {
    return (
      <g {...this.state.g}>
        <circle
          stroke="grey"
          cy={dims[1] / 2}
          {...this.state.circle}
        />
        <text
          x="0"
          y="20"
          fill="#333"
          transform="rotate(-45 5,20)"
        >{`x: ${this.state.g.transform}`}</text>
        <text
          x="0"
          y="5"
          fill="#333"
          transform="rotate(-45 5,20)"
        >{`name: ${this.props.data.name}`}</text>
      </g>
    );
  }
}
```

### `Removing Items from Transitions`

Your node component receives a remove function that simply needs to be invoked (no parameters) to ensure the node is removed. The API tracks closely with how [D3](https://github.com/d3/d3-selection) works.
This provides a lot of control and helps with quickly debugging transitions.
For example, it's much easier to make sure your nodes "recover" correctly if they are interrupted on an exit transition.
Just comment out the remove line and run your transitions.
Nodes that would have been removed are now "updating" and you can simulate what would happen if a transition were interrupted just before they left the document.

Example of scheduling the remove function: 
```js
onExit = () => ({
  opacity: [1e-6],
  fill: 'red',
  timing: { duration: 1000 },
  events: { end: this.props.remove },
})
```

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
