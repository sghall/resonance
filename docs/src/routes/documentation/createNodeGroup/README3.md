You don't have to keep your state flat either.
You can create "namespaces" that allow you to organize state in a way that makes sense for your component. In the example below, you can get sense of how this works.

The initial state looks like this:
```js
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
```
The "g" and "circle" keys are objects.  You can specify transitions just like you did with the flat state.
You always specify timing and events per top-level state key, so if you need to break things up for different timing just adjust your state keys to accomodate.
This gives an incredible amount of flexibility to produce really complex animations.

What's also nice is you can then just spread your state in the render method.  Better ergonomics for complex components.
```js
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
