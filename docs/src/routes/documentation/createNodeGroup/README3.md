You don't have to keep your state flat.
You can create "namespaces" that allow you to organize state in a way that makes sense for your component.

In the example below, you can get sense of how this works.

The initial state looks like this:
```js
state = {
  opacity: 1e-6,
  circle: {
    r: 1e-6,
    cx: this.props.scale(this.props.data.name) + (this.props.scale.bandwidth() / 2),
    strokeWidth: 1e-6,
    fill: 'green',
  },
}
```
The "circle" key is an object.  You can specify transitions just like you did with the flat state.
You always specify timing and events per top-level state key, so if you need to break things up for different timing just adjust your state keys to accomodate.
This gives an incredible amount of flexibility to produce really complex animations.

What's also nice is you can then just spread your state in the render method.  Better ergonomics for complex components.
```js
render() {
  return (
    <g opacity={this.state.opacity}>
      <circle
        stroke="grey"
        cy={dims[1] / 2}
        {...this.state.circle}
      />
    </g>
  );
}
```

Here's the complete circle component from the example below:
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
    opacity: 1e-6,
    circle: {
      r: 1e-6,
      cx: this.props.scale(this.props.data.name) + (this.props.scale.bandwidth() / 2),
      strokeWidth: 1e-6,
      fill: 'green',
    },
  }

  onEnter = () => ({
    opacity: [0.4],
    circle: {
      r: [this.props.scale.bandwidth() / 2],
      strokeWidth: [(this.props.index + 1) * 2],
      fill: 'green',
    },
    timing: { duration: 1000, ease: easeExpInOut },
  })

  onUpdate() {
    const { scale, index, data: { name } } = this.props;

    return {
      opacity: [0.4],
      circle: {
        r: [this.props.scale.bandwidth() / 2],
        cx: [scale(name) + (scale.bandwidth() / 2)],
        strokeWidth: [(index + 1) * 2],
        fill: 'blue',
      },
      timing: { duration: 1000, ease: easeExpInOut },
    };
  }

  onExit = () => ({
    opacity: [1e-6],
    circle: {
      fill: 'red',
    },
    timing: { duration: 1000, ease: easeExpInOut },
    events: { end: this.props.remove },
  })

  render() {
    return (
      <g opacity={this.state.opacity}>
        <circle
          stroke="grey"
          cy={dims[1] / 2}
          {...this.state.circle}
        />
      </g>
    );
  }
}
```
