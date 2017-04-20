## Resonance | Data-Driven Transitions in React

[![Build Status](https://travis-ci.org/sghall/resonance.svg?branch=master)](https://travis-ci.org/sghall/resonance)
[![Coverage Status](https://coveralls.io/repos/github/sghall/resonance/badge.svg?branch=master)](https://coveralls.io/github/sghall/resonance?branch=master)
[![Dependency Status](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0)
[![Greenkeeper badge](https://badges.greenkeeper.io/sghall/resonance.svg)](https://greenkeeper.io/)

This small library uses [d3-timer](https://github.com/d3/d3-timer) to efficiently schedule animated transitions and provides a simple interface for utilizing [D3 interpolators](https://github.com/d3/d3-interpolate).
Documentation and examples are a work in progress. PRs/feedback/comments/suggestions welcome.

Take a look at the Webpack bundle for [Resonance](https://sghall.github.io/resonance/#/examples/webpack-sunburst).

<a href="https://sghall.github.io/resonance/#/examples/webpack-sunburst">
  <img src="https://cloud.githubusercontent.com/assets/4615775/25240281/45acec66-25a7-11e7-9e6a-83012473b748.png" height="300px"/>
</a>


This is an experimental library and will have breaking changes going forward.
I started working on this idea with [React Fiber](https://github.com/acdlite/react-fiber-architecture) in mind but it's not [ready yet](http://isfiberreadyyet.com/).
The master branch and the example site will continue with the latest stable release of React.  Work on React Fiber will be done on a separate branch.

## Installation

Resonance is available as an [npm package](https://www.npmjs.org/package/resonance).

```sh
npm install resonance
```

## Examples

[Example Site](https://sghall.github.io/resonance/#/examples/states-by-age) - Live demo of examples. 

[Example Code](https://github.com/sghall/resonance/tree/master/docs/src/routes/examples) - Each example is built like a mini [redux](http://redux.js.org/) application with its actions and reducers defined in a small module.
Resonance does not depend on redux but it is built with this type architecture in mind.

**To run the examples in this repo locally:**
 - clone the repo and cd into the directory 
 - npm install && cd docs && npm install && npm start
 - go to http://localhost:3000/


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

## The Basic Idea

D3 stores data and transition schedules in DOM nodes, but that fights against React's virtual DOM approach. Resonance accomplishes the same thing in a way that works with React.
Behind the scenes it takes the same basic scheduling method used in D3 and much of the same tooling and schedules transitions against your React components.

Resonance handles much of the heavy lifting for:

* Transitioning numbers, strings, colors, SVG transforms...
* Setting transition durations and delays
* Transition interrupts
* Hooks for transition events (start, interrupt, end)
* Custom tween functions
* Specifying ease functions
* Stopping transitions on component unmount

## NodeGroup

The main component of the library is the NodeGroup.  You can think of it as a React version of D3's selection.data method. Selection.data breaks your data array into entering, updating and exiting nodes and allows you to operate on them as the selection updates.
Using Resonance you pass an array of data objects (at the moment, they have to be objects) into the NodeGroup and give it a key accessor function that returns a string key when passed a data object.
That key is used by React to keep track of what's mounted. You also pass a component to the NodeGroup that will be used to render the nodes in the group.

```js
import NodeGroup from 'resonance/NodeGroup';
import Node from './Node';

const keyAccessor = (d) => d.name;

<NodeGroup
  data={nodes}
  nodeComponent={Node}
  keyAccessor={keyAccessor}
/>
```

Inside your component you receive the data object, index, type and a function to call to remove the node. 

In Resonance, the types are:
```js
APPEAR ~= d3 enter
UPDATE ~= d3 update
REMOVE ~= d3 exit
```

You receive the type as a prop in your component but you will rarely use it directly. Every time the data updates the NodeGroup updates its state and calls the appropriate method (if implemented) on your component for you.
It calls it in the context of your component so you have access to props, state, etc.

The three transition methods you can implement are:
```js
onAppear
onUpdate
onRemove
```

So a typical component would look like...
```js
class Node extends Component {
  static propTypes = {
    data: PropTypes.object,
    type: PropTypes.string,
    index: PropTypes.number,
    removeNode: PropTypes.func,
  };

  state = {
    ...
  }

  onAppear() {
  	const { data, index } = this.props;
  	...
  }

  onUpdate() {
  	const { data, index } = this.props;
  	...
  }

  onRemove() {
  	const { data, index } = this.props;
  	...
  }

  render() {
  	...
  }
}
```

You can implement none, one, two or all three of the transition methods.  Just depends on what your trying to achieve.

## Component Lifecycle

The lifecycle of a node component differs from how D3 handles DOM nodes in an important way.
D3 queries the DOM to figure out what is still mounted when you update a selection.  When you finish an exit transition you call selection.remove to remove the element from the document.  It is dettached from the DOM immediately on calling that method and, therefore, won't show up in future selections.

In React, the data is stored in components as props and state. Resonance does not remove the node from the tree when you call removeNode (a function passed down to you).  It marks that key as removed in a map that it maintains internally, but does not update the state to remove the actual element at that time.
This avoids a lot of DOM thrashing and makes the transitions easier to reason about. It is different than how it happens in D3 though and needs to be considered when setting up transitions.

In practical terms, you generally lower the opacity, move the node off the screen or turn off the nodes visibility on an exit transition. In Resonance the node will remain there until there's another data update instead of causing more thrashing of the DOM.
You can't do that in D3 because the DOM is storing the data.  The implication is that, unlike in D3, you can have a DOM element that moves from type REMOVE to APPEAR.  You just need to define what the properties should start out as and transition to in your onAppear method.

You can see this in practice in the [bar component](https://github.com/sghall/resonance/blob/master/docs/src/routes/examples/statesByAge/components/Bar.js) from the [bar chart example](https://sghall.github.io/resonance/#/examples/states-by-age).

Its onAppear method is defined like this...
```js
onAppear() {
  const { yScale, duration, data: { xVal, yVal } } = this.props;

  return {
    node: {
      opacity: [1e-6, 1],
      transform: ['translate(0,500)', `translate(0,${yVal})`],
    },
    rect: { width: xVal, height: yScale.bandwidth() },
    text: { x: xVal - 3 },
    timing: { duration, ease: easePoly },
  };
}
```
How to define transitions is explained in more detail below, but this will make sure any in-flight animations are stopped (i.e. interrupted onRemove transitions), make sure various attributes are set correctly and fires off new transitions for the node opacity and transform [from, to].

## Defining Transitions

Inside your transition methods you return an object that describes how you want to transition the state of your component.

Let's look at the [bar component](https://github.com/sghall/resonance/blob/master/docs/src/routes/examples/statesByAge/components/Bar.js) from the [bar chart example](https://sghall.github.io/resonance/#/examples/states-by-age) for a real world task with some complexity.
The initial state of the component looks like this...
```js
class Bar extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      xVal: PropTypes.number.isRequired,
      yVal: PropTypes.number.isRequired,
    }).isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  state = {
    node: {
      opacity: 1e-6,
      transform: 'translate(0,500)',
    },
    rect: {
      width: this.props.data.xVal,
      height: this.props.yScale.bandwidth(),
    },
    text: {
      x: this.props.data.xVal - 3,
    },
  }

  onAppear() {
  	...
  }

  onUpdate() {
  	...
  }

  onRemove() {
  	...
  }

  render() {
    const { xScale, yScale, data: { name, xVal } } = this.props;

    return (
      <g {...this.state.node}>
        <rect
          fill={palette.primary1Color}
          opacity={0.4}
          {...this.state.rect}
        />
        <text
          dy="0.35em"
          x={-15}
          textAnchor="middle"
          fill={palette.textColor}
          fontSize={10}
          y={yScale.bandwidth() / 2}
        >{name}</text>
        <text
          textAnchor="end"
          dy="0.35em"
          fill="white"
          fontSize={10}
          y={yScale.bandwidth() / 2}
          {...this.state.text}
        >{percentFormat(xScale.invert(xVal))}</text>
      </g>
    );
  }
}

export default Bar;
```

The way you describe what you want to do is evolving but here's how it works right now.
On the state above, notice there are three "top level" keys: node, rect and text.
In Resonance you can run transitions against the properties of these top level objects and it will handle scheduling, interrupts, etc for you.
You always have some top level key(s) on your state that is an object composed of string and number properties (primitive values).
You can have as many top level keys as you want each with as many properites as you want.

So in the case above the "node" state object has "opacity" and "transform" properites on it.  Those properties are what actually get interpolated over time.
If you create a new transition on the "node" key it will interrupt the old ones on the opacity and transform keys and start new ones.  If the component unmounts it will kill any running transitions.

Notice that the properties that get transitioned are named exactly what the SVG attributes are called: transform, opacity, x, y, etc.
That's partly out of convenience so you can just spread them in the render function like so...
```js
  render() {
    return (
      <g {...this.state.node}>
       ...
      </g>
    );
  }
}
```
For the most part, you can call the properties whatever you want, but there is one special case: transform. 

## Interpolators

When you use the property name "transform" you are telling Resonance that it needs to use the special D3 SVG transform interpolator to transition it.
This is essentially the same way D3 handles transitions. If it's a transform attribute it uses that special interpolator. After that it looks at the value. If it's a number it uses the number interpolator.  If it's a string, it checks to see if it's a color and uses a color interpolator.  After that you get the regular string interpolator.
Resonance uses the same process to figure out what interpolator to use. Here's the function used to determine the interpolator...    
```js
import {
  interpolateRgb,
  interpolateNumber,
  interpolateString,
  interpolateTransformSvg,
} from 'd3-interpolate';
import { color } from 'd3-color';

export function getInterpolator(attr, value) {
  if (attr === 'transform') {
    return interpolateTransformSvg;
  } else if (typeof value === 'number') {
    return interpolateNumber;
  } else if (value instanceof color || color(value) !== null) {
    return interpolateRgb;
  }

  return interpolateString;
}
```

In your onAppear, onUpdate and onRemove methods you return an object to describe how to transition this state.
In the bar component the onAppear method looks like this...
```js
onAppear() {
  const { yScale, duration, data: { xVal, yVal } } = this.props;

  return {
    node: {
      opacity: [1e-6, 1],
      transform: ['translate(0,500)', `translate(0,${yVal})`],
    },
    rect: { width: xVal, height: yScale.bandwidth() },
    text: { x: xVal - 3 },
    timing: { duration, ease: easePoly },
  };
}
```
The method, in this case, returns an object.  

**Note: In an upcoming release it will accept an array of objects so you can define custom timing and events on different keys.**

There are two reserved keys for your transition objects: timing and events. Both are optional.

The default timing object looks like this...
```js
const default = {
  delay: 0,
  duration: 250,
  ease: easeCubicInOut,
};
```
You can override these properties.  Just specify the keys you want to change.  You can use any easing function you want like those from [d3-ease](https://github.com/d3/d3-ease).

The events are the same as in D3.  You can specify a function to be called on the start, end or interrupt event of a transition.
In the bar chart component the removeNode function gets called on the end event...
```js
onRemove() {
  const { duration, removeNode } = this.props;

  return {
    node: {
      opacity: [1e-6],
      transform: ['translate(0,500)'],
    },
    timing: { duration, ease: easePoly },
    events: { end: removeNode },
  };
}
```
You specify what you want to be done using a shorthand (still working on this idea). There's four options:

1. Number or String - The state will be set to that value when the method is called.  Any existing transitions on that top level key will be stopped.
2. [value] - An array with length 1. Transition the state from where it is to that value.  The value should be a string or number.
3. [value, value] - An array with length === 2. Set the state to the first value immediately and transition to the second value.
4. Function -  Custom tween function. If you return a function it will be used as a custom tween function.
