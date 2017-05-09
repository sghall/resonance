## Namespacing your state

You don't have to keep your state flat either.
You can create "namespaces" that allow you to organize state in a way that makes sense for your component. In the example below, you can get sense of how this works.

**Example starting state:**
```js
start={(/* node, index */) => ({
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
```
The "g" and "circle" keys are objects.  You can specify transitions just like you did with the flat state within each object.
This gives an incredible amount of flexibility to produce complex animations.

What's also nice is you can then just spread your state in the render function:
```js
render={(node, state) => {
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
      >{`name: ${node.name}`}</text>
    </g>
  );
}}
```
