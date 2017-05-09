Here's the complete NodeGroup component for the circles from the example above:
```js
<NodeGroup
  data={this.state.data}
  keyAccessor={(d) => d.name}

  start={() => ({
    g: {
      opacity: 1e-6,
      transform: 'translate(0,0)',
    },
    circle: {
      r: 1e-6,
      strokeWidth: 1e-6,
      fill: 'green',
    },
  })}

  enter={(data, index) => ({
    g: {
      opacity: [0.4],
      transform: [`translate(${scale(data.name) + (scale.bandwidth() / 2)},0)`],
    },
    circle: {
      r: [scale.bandwidth() / 2],
      strokeWidth: [(index + 1) * 2],
      fill: 'green',
    },
    timing: { duration: 1000, ease: easeExpInOut },
  })}

  update={(data, index) => ({
    g: {
      opacity: [0.4],
      transform: [`translate(${scale(data.name) + (scale.bandwidth() / 2)},0)`],
    },
    circle: {
      r: [scale.bandwidth() / 2],
      strokeWidth: [(index + 1) * 2],
      fill: 'blue',
    },
    timing: { duration: 1000, ease: easeExpInOut },
  })}

  leave={(data, index, remove) => ({
    g: {
      opacity: [1e-6],
    },
    circle: {
      fill: 'red',
    },
    timing: { duration: 1000, ease: easeExpInOut },
    events: { end: remove },
  })}

  render={(data, state) => {
    return (
      <g {...state.g}>
        <circle
          stroke="grey"
          cy={dims[1] / 2}
          {...state.circle}
        />
        <text
          x="0"
          y="20"
          fill="#333"
          transform="rotate(-45 5,20)"
        >{`x: ${state.g.transform}`}</text>
        <text
          x="0"
          y="5"
          fill="#333"
          transform="rotate(-45 5,20)"
        >{`name: ${data.name}`}</text>
      </g>
    );
  }}
/>
```


