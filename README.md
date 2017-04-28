## Resonance | Data-driven transitions in React

[![Build Status](https://travis-ci.org/sghall/resonance.svg?branch=master)](https://travis-ci.org/sghall/resonance)
[![Coverage Status](https://coveralls.io/repos/github/sghall/resonance/badge.svg?branch=master)](https://coveralls.io/github/sghall/resonance?branch=master)
[![Dependency Status](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0)
[![Greenkeeper badge](https://badges.greenkeeper.io/sghall/resonance.svg)](https://greenkeeper.io/)
![](http://img.badgesize.io/sghall/resonance/gh-pages/dist/resonance.min.js.svg?label=minified)
![](http://img.badgesize.io/sghall/resonance/gh-pages/dist/resonance.js.svg?compression=gzip)

Animated state transitions that update with your data. 
This library uses [d3-timer](https://github.com/d3/d3-timer) and a sophisticated scheduling mechanism to efficiently manage thousands of state tweens.
You can apply high-performance state animations using an appraochable, easy to implement syntax.
[Get Started](https://sghall.github.io/resonance/#/documentation/create-node-group).

## Installation

Resonance is available as an [npm package](https://www.npmjs.org/package/resonance).

```sh
npm install resonance
```

## Why would I need this?

**Resonance handles much of the heavy lifting for...**
* Creating expressive custom transitions easily
* Animating anything! HTML, SVG, React-Native components...
* Transitioning numbers, strings, colors, SVG transforms...
* Setting transition durations and delays
* Handling transition interrupts
* Hooks for transition events (start, interrupt, end)
* Custom tween functions
* Specifying ease functions
* Stopping transitions on component unmount

## Run documentation/examples locally 

**To run the documentation/examples site in this repo locally:**
 - clone the repo and cd into the directory 
 - npm install && cd docs && npm install && npm start
 - go to http://localhost:3000/

## SVG Chart Examples

You can animate any component with Resonance, but it was developed by experimenting with animated SVG charts and redux.
This library is great for creating abstact animated data visualizations in React.
You can view the [example code](https://github.com/sghall/resonance/tree/master/docs/src/routes/examples) here for the chart examples.
Each example is a mini [redux](http://redux.js.org/) application with its actions and reducers defined in a small module.
You can run these examples locally by following the direction above.

<a href="https://sghall.github.io/resonance/#/examples/webpack-sunburst">
  <img src="https://cloud.githubusercontent.com/assets/4615775/25240281/45acec66-25a7-11e7-9e6a-83012473b748.png" height="150px"/>
</a>
<a href="https://sghall.github.io/resonance/#/examples/alluvial-chart">
  <img src="https://cloud.githubusercontent.com/assets/4615775/24084023/d736ddde-0c9f-11e7-8646-b953dd368c84.jpg" height="150px"/>
</a>
<a href="https://sghall.github.io/resonance/#/examples/states-by-age">
  <img src="https://cloud.githubusercontent.com/assets/4615775/24084025/d7397e86-0c9f-11e7-90b6-9a99f056f4c9.jpg" height="150px"/>
</a>
<a href="https://sghall.github.io/resonance/#/examples/packed-by-age">
  <img src="https://cloud.githubusercontent.com/assets/4615775/24084024/d7371ace-0c9f-11e7-8616-3941fd62aa55.jpg" height="150px"/>
</a>
<a href="https://sghall.github.io/resonance/#/examples/stacked-area">
  <img src="https://cloud.githubusercontent.com/assets/4615775/24084030/de9ec4e2-0c9f-11e7-85d8-3be0bbc5c7d0.jpg" height="150px"/>
</a>

## createNodeGroup
[Docs/Examples for createNodeGroup](https://sghall.github.io/resonance/#/documentation/create-node-group)

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
The methods return either a single object or an array of objects that describe how to transform the component state.
Passing arrays allows you to specifiy **independent timing for transitions on each key** in your state (explained in more detail [in the docs](https://sghall.github.io/resonance/#/documentation/create-node-group)).
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

You can do far more complex things, however.  First, you can pass an array of transition objects.
**Each key in the state can have its own independent timing parameters (easing function, duration, delay) and its own event handlers.**

The default timing parameters are:

```js
const defaultTiming = {
  delay: 0,
  duration: 250,
  ease: easeCubicInOut,
}; 
```

Just override what you need to in your transition object:

```js
import { easeExpInOut } from 'd3-ease';

onUpdate = () => ([  // An array!!
  {
    opacity: [0.6],
    fill: ['blue', 'grey'],
    timing: { duration: 2000 }, // specify duration for fill and opacity
  },
  {
    x: [this.props.xScale(this.props.data.name)],
    timing: { duration: 2000, ease: easeExpInOut }, // duration and d3-ease function for x
  },
  {
    width: [this.props.xScale.bandwidth()],
    timing: { duration: 500 }, // separate timing for width
  },
  {
    height: [this.props.yScale(this.props.data.value)],
    timing: { delay: 2000, duration: 500 }, // add delay and duration for height
    events: { //Events!! When this transition has finished set the fill to 'steelblue';
      end: () => {
        this.setState({ fill: 'steelblue' });
      },
    },
  },
])
```

You have the same transition event hooks that you have on transitions in D3: **start**, **interrupt** and **end**.
Just pass a function to be called in the events section of your transition object.

See the [live examples and documentation](https://sghall.github.io/resonance/#/documentation/create-node-group) for more.

## createTickGroup  
[Docs/Examples for createTickGroup](https://sghall.github.io/resonance/#/documentation/create-tick-group)

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


