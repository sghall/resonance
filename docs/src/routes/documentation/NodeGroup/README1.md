[Checkout the project on Github](https://github.com/sghall/resonance)

## NodeGroup  

Factory that returns a NodeGroup component.

### `createNodeGroup(nodeComponent, wrapperComponent, keyAccessor)`

#### Arguments:

* `nodeComponent` *(Component)*: Component that will be used to render each object in the data array.

* `wrapperComponent` *(Component)*: Component that will be used to wrap the nodes. Can be a custom component.

* `keyAccessor` *(Function)*: Function that returns a string key given a data object.

#### Returns:

A NodeGroup component that will render wrapped node components for each item in the data prop.

```js
// BarGroup.js
import createNodeGroup from 'resonance/createNodeGroup';
import Bar from './Bar';

// Exports a component that will take a data prop and render a Bar component for each object in a data array.
// Each Bar will be wrapped in a withTransitions HOC that allows you to transition its state.
// A 'g' element will be the wrapper component.  This could also be a custom component or 'div', 'span', etc.
// The keyAccessor should return a string key when given a data object.
// The string key is used to determine which bars are entering, updating and exiting.

export default createNodeGroup(Bar, 'g', (data) => data.name);
```

### `NodeGroup` - Component

#### Props:

* `data` *(array)*: Array of objects.  Each object will be rendered into a wrapped node component.

* `className` *(string)*: Class for the container component. Defaults to 'node-group'. `(Optional)`


```js
import BarGroup from './BarGroup'; // NodeGroup created above

class MyComponent extends Component {

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

export default MyComponent;
```
