## createNodeGroup

Class factory that returns a NodeGroup component. 

### `createNodeGroup(nodeComponent, component, keyAccessor)`

```js
// BarGroup.js

import Bar from './Bar';

// Exports a component that will take a data prop and render a wrapped Bar component for each object in the array.
// Each Bar is wrapped in a withTransitions HOC that allows you to transition it's state.
// A 'g' element will be the container component.  This could also be a custom component or 'div', 'span', etc.
// The keyAccessor should return a string key and is used to determine which bars are entering, updating and exiting.

export default createNodeGroup(Bar, 'g', (data) => data.name);

```

#### Arguments

* `nodeComponent` *(Component)*: Component that will be used to render each object in the data array.

* `component` *(Component)*: Component that will be used as the container for the nodes. Can be a custom component.

* `keyAccessor` *(Function)*: Function that returns a string key given a data object.


```js
// Import the BarGroup created above.

import BarGroup from './BarGroup';

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


