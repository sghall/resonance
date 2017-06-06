Here's the complete NodeGroup component for the pieChart above.

[SOURCE CODE FOR THIS EXAMPLE](https://github.com/sghall/resonance/tree/master/docs/src/routes/documentation/NodeGroup/Example5.js)

```js
<NodeGroup
  data={arcs}
  keyAccessor={(d) => d.data.name}

  start={(d) => ({
    fill: colors(d.data.name),
    d: arcPath(d),
    opacity: 0,
  })}

  enter={() => ({
    opacity: [1],
    timing: { duration: 1500 },
  })}

  update={(d) => ({
    opacity: [1],
    d: this.arcTween(arcsCache[d.data.name], d, d.data.name),
    timing: { duration: 1500 },
  })}

  leave={(d, index, remove) => {
    remove();
  }}

  render={(data, state) => {
    return (
      <path {...state} />
    );
  }}
/>
```

Pie charts needs to have the previous arc data to properly do the transition between them.
If data changes a lot, the state needs to always contain the last shown data and it should never be replaced otherwise
it starts flickering.

Therefore, you will need multiple things to get it working:

Initial constructor that builds up arcs cache:
```js
constructor(props) {
  super(props);

  const data = mockData.map((n) => {
    return { ...n, value: Math.random() };
  });

  const newArcs = getArc(data);
  this.state = {
    data,
    arcs: newArcs,
    arcsCache: newArcs.reduce((m, n) => {
      return Object.assign(m, { [n.data.name]: n });
    }, {}),
    arcsCount: 10,
  };
}
```

Pie layout:
```js
const getArc = pie()
  .value((d) => d.value)
  .sort(null);
```

Arc generation function:
```js
const arcPath = arc()
  .innerRadius((dims[1] / 3.5))
  .outerRadius((dims[1] / 2));
```

`arcTween` function:
```js
arcTween = (beg, end, name) => {
  const i = interpolate(beg, end);

  return (t) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        arcsCache: { ...prevState.arcsCache, [name]: i(t) },
      };
    });
    return arcPath(i(t));
  };
};
```

What happens here is the following:
1. Constructor:
   *  Generation of random data
   *  Cache arcs final data in the state (it's a Map)
2. When update is called:
   * arcTween gets called
   * For each time _t_ of the animation, the `arcsCache` gets updated with current state
   like that, if you randomize while animation occurs there is no flickering.
