[Checkout the project on Github](https://github.com/sghall/resonance)

## createNodeGroup  

Factory that returns a NodeGroup component. 

### `createNodeGroup(nodeComponent, containerComponent, keyAccessor)`

#### Arguments:

* `nodeComponent` *(Component)*: Component that will be used to render each object in the data array.

* `containerComponent` *(Component)*: Component that will be used as the container for the nodes. Can be a custom component.

* `keyAccessor` *(Function)*: Function that returns a string key given a data object.

#### Returns:

A NodeGroup component that will render wrapped node components for each array item provided in its data prop.

```js
// BarGroup.js

import Bar from './Bar';

// Exports a component that will take a data prop and render a wrapped Bar component for each object in the data array.
// Each Bar is wrapped in a withTransitions HOC that allows you to transition its state.
// A 'g' element will be the container component.  This could also be a custom component or 'div', 'span', etc.
// The keyAccessor should return a string key when given a data object.
// The string key is used to determine which bars are entering, updating and exiting.

export default createNodeGroup(Bar, 'g', (data) => data.name);

```

### `NodeGroup` - Component

#### Props:

* `data` *(array)*: Array of objects.  Each object will be rendered into a wrapped node component.

* `className` *(string)*: Class for the container component. (Optional)


```js
import BarGroup from './BarGroup'; // NodeGroup created above

class Parent extends Component {

  ...

  render() {
    return (
      ....
        <BarGroup
          data={this.props.data}  // Render the BarGroup with a data prop (updates Bars if next.data !== prev.data)
          className="bar-group"   // Optional classname for container component defaults to 'node-group'
          otherProp1={otherProp1} // All other props passed down to the Bar component
          otherProp2={otherProp2}
        />
      ....
    );
  }
}

export default Parent;
```

Inside your node component you just implement onEnter, onUpdate and onExit methods.
The methods should return a transition object that describes how to transform the component state.
The methods are called after all the nodes have updated so the latest props are available.
Your node component receives the data, index, any other props rendered to the NodeGroup and a remove function.

Here's the Bar component from the first example below:
```js
class Bar extends Component {
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
      </g>
    );
  }
}
```