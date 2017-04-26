## Resonance | Expressive Animated Transitions in React

[![Build Status](https://travis-ci.org/sghall/resonance.svg?branch=master)](https://travis-ci.org/sghall/resonance)
[![Coverage Status](https://coveralls.io/repos/github/sghall/resonance/badge.svg?branch=master)](https://coveralls.io/github/sghall/resonance?branch=master)
[![Dependency Status](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0)
[![Greenkeeper badge](https://badges.greenkeeper.io/sghall/resonance.svg)](https://greenkeeper.io/)
![](http://img.badgesize.io/sghall/resonance/gh-pages/dist/resonance.min.js.svg?label=minified)
![](http://img.badgesize.io/sghall/resonance/gh-pages/dist/resonance.js.svg?compression=gzip)

## res·o·nance
>the quality or state of being resonant

Make your app resonate with your users!  Add some animation!
[Get Started](https://sghall.github.io/resonance/#/documentation/create-node-group)

## Installation

Resonance is available as an [npm package](https://www.npmjs.org/package/resonance).

```sh
npm install resonance
```

## Why would I need this?

Resonance handles much of the heavy lifting for:

* Creating expressive custom transitions easily
* Animating anything! HTML, SVG, React-Native components...
* Transitioning numbers, strings, colors, SVG transforms...
* Setting transition durations and delays
* Transition interrupts
* Hooks for transition events (start, interrupt, end)
* Custom tween functions
* Specifying ease functions
* Stopping transitions on component unmount

## Examples

**To run the documentation/examples site in this repo locally:**
 - clone the repo and cd into the directory 
 - npm install && cd docs && npm install && npm start
 - go to http://localhost:3000/


## createNodeGroup
[docs/examples for createNodeGroup](https://sghall.github.io/resonance/#/documentation/create-node-group)

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

Inside your node component you just implement **onEnter**, **onUpdate** and **onExit** methods.
The methods should return a transition object that describes how to transform the component state (explained in more detail below).
The methods are called after all the nodes have updated so the latest props are available.
Your node component receives the data, index, any other props rendered to the NodeGroup and a remove function.

Here's the example Bar component:
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

## createTickGroup  
[docs/examples for createTickGroup](https://sghall.github.io/resonance/#/documentation/create-tick-group)

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


