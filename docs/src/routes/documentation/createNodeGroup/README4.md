
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



