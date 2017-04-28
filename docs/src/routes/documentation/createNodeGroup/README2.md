
Inside your node component you just implement **onEnter**, **onUpdate** and **onExit** methods.
The methods return either a single object or an array of objects that describes how to transform the component state (explained in more detail below).
The methods are called after all the nodes have updated so the latest props are available.
Your node component receives the data, index, any other props rendered to the NodeGroup and a remove function.

Here's the Bar component from the first example above:
```js
class Bar extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    scale: PropTypes.func.isRequired,  // prop passed down from NodeGroup
    remove: PropTypes.func.isRequired, // function passed down to each node
  }

  state = {
    opacity: 1e-6,
    x: 0,
    fill: 'green',
    width: 1e-6,
  }

  onEnter = () => ({
    opacity: [0.5],
    x: [this.props.scale(this.props.data.name)],
    width: [this.props.scale.bandwidth()],
    timing: { duration: 200 * this.props.index, delay: 1000 },
  })

  onUpdate = () => ({
    opacity: [0.5],
    x: [this.props.scale(this.props.data.name)],
    fill: 'blue',
    width: [this.props.scale.bandwidth()],
    timing: { duration: 1000, ease: easePoly },
  })

  onExit = () => ({
    opacity: [1e-6],
    x: [this.props.scale.range()[1]],
    fill: 'red',
    timing: { duration: 1000 },
    events: { end: this.props.remove },
  })

  render() {
    const { x, ...rest } = this.state;

    return (
      <g transform={`translate(${x},0)`}>
        <rect
          height={dims[1]}
          {...rest}
        />
        <text
          x="0"
          y="20"
          fill="white"
          transform="rotate(90 5,20)"
        >{`x: ${x}`}</text>
        <text
          x="0"
          y="5"
          fill="white"
          transform="rotate(90 5,20)"
        >{`name: ${this.props.data.name}`}</text>
      </g>
    );
  }
}
```

You can do far more complex things, however.  First, you can pass an array of transition objects.
**Each key in the state can have its own independent timing parameters (easing function, duration, delay) and its own event handlers.**

The default timing parameters are:

```js
const defaultTiming = {
  delay: 0,
  duration: 250,
  ease: easeCubicInOut,
}; 
```
You have the same transition event hooks that you have on transitions in D3: **start**, **interrupt** and **end**.
Just pass a function to be called in the events section of your transition object.

Here's the Bar component from the next example below:
```js
class Bar extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }

  state = {
    opacity: 1e-6,
    x: 0,
    fill: 'green',
    width: this.props.xScale.bandwidth(),
    height: 0,
  }

  onEnter = () => ([  // An array!!
    {
      opacity: [0.6],
      width: [this.props.xScale.bandwidth()],
      height: [this.props.yScale(this.props.data.value)],
      timing: { duration: 1000 },
    },
    {
      x: [this.props.xScale(this.props.data.name)],
      timing: { duration: 100 * this.props.index, ease: easePoly },
    },
  ])

  onUpdate = () => ([  // An array!!
    {
      opacity: [0.6],
      fill: ['blue', 'grey'],
      timing: { duration: 2000 },
    },
    {
      x: [this.props.xScale(this.props.data.name)],
      timing: { duration: 2000, ease: easeExpInOut },
    },
    {
      width: [this.props.xScale.bandwidth()],
      timing: { duration: 500 },
    },
    {
      height: [this.props.yScale(this.props.data.value)],
      timing: { delay: 2000, duration: 500 },
      events: { // Events!!
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

  render() {
    const { x, height, ...rest } = this.state;

    return (
      <g transform={`translate(${x},0)`}>
        <rect
          y={height}
          height={dims[1] - height}
          {...rest}
        />
        <text
          x="0"
          y="20"
          fill="grey"
          transform="rotate(90 5,20)"
        >{`x: ${x}`}</text>
        <text
          x="0"
          y="5"
          fill="grey"
          transform="rotate(90 5,20)"
        >{`name: ${this.props.data.name}`}</text>
      </g>
    );
  }
}
```
