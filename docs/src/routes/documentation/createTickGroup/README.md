[Checkout the project on Github](https://github.com/sghall/resonance)

## createTickGroup  

Factory that returns a TickGroup component. 

This is a more specialized factory than **createNodeGroup**. It's designed for animated data visualizations but could have other applications.
The usage of this factory is largely the same as **createNodeGroup** except it treats a [D3 scale](https://github.com/d3/d3-scale) as immutable instead of a data array.
When the scale changes it calls the scale.ticks function.  Right now it works only with continuous scales.
More documentation and examples will be added in future releases. 

### `createTickGroup(tickComponent, wrapperComponent)`

#### Arguments:

* `tickComponent` *(Component)*: Component that will be used to render each tick returned from the provided scale.

* `wrapperComponent` *(Component)*: Component that will be used to wrap the ticks. Can be a custom component.


#### Returns:

A TickGroup component that will render wrapped tick components.

```js
// TickGroup.js
import createTickGroup from 'resonance/createTickGroup';
import Tick from './Tick';

// Exports a component that will take a scale prop and render a Tick component for each tick.
// Each Tick will be wrapped in a withTransitions HOC that allows you to transition its state.
// A 'g' element will be the wrapper component.  This could also be a custom component or 'div', 'span', etc.

export default createTickGroup(Tick, 'g');
```

### `TickGroup` - Component

#### Props:

* `scale` *(function)*: Continuous D3 scale. Each tick will be rendered into a wrapped tick component.

* `tickCount` *(number)*: Approximate count of ticks to be shown. Defaults to 10. `(Optional)`

* `className` *(string)*: Class for the container component. Defaults to 'tick-group'. `(Optional)`


```js
import TickGroup from './TickGroup'; // TickGroup created above

class MyComponent extends Component {

  ...

  render() {
    return (
      ....
        <TickGroup
          scale={this.props.scale} // Render the TickGroup with a scale prop (updates Ticks if next.scale !== prev.scale)
          tickCount={5}            // Optional count of ticks to render. Defaults t0 10
          className="my-ticks"     // Optional classname for container component. Defaults to 'tick-group'
          otherProp1={otherProp1}  // All other props passed down to the Tick component
          otherProp2={otherProp2}
        />
      ....
    );
  }
}

export default MyComponent;
```



