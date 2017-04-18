## Resonance

Data driven transitons in React. Covering the 5% of animations that [react-motion](https://github.com/chenglou/react-motion) doesn't handle.

This very small (and very experimental) library harnesses the power of [d3-timer](https://github.com/d3/d3-timer) which can efficiently schedule 1000s of animated transitions.
It provides an interface for utilizing the various [d3 interpolaters](https://github.com/d3/d3-interpolate) to make state transitions.  All the examples are SVG and my focus is on data visualization, but this could be used to transition any component state really.

The basic idea. D3 stores data and schedules transitions against DOM nodes.  Resonance takes the same scheduling mechanism and much of the same tooling (d3 4.0 modules) and schedules transitions against your React components.
It handles interrupts, applying [d3-ease](https://github.com/d3/d3-timer) functions and stopping in-flight transitions on unmount for you.

This is an experimental library and will have breaking changes going forward.
I started working on this idea with [React Fiber](http://isfiberreadyyet.com/) in mind.  Fiber will allow you to set priority levels on state updates.  Fiber is not ready yet and, last I heard, setting of priority levels won't land until React 17.
In the mean time, the library and the example site are using React 15.5 and the performance is pretty good.

[examples](https://sghall.github.io/resonance/#/examples/states-by-age) are a work in progress.  Feedback welcome. 

[![Build Status](https://travis-ci.org/sghall/resonance.svg?branch=master)](https://travis-ci.org/sghall/resonance)
[![Coverage Status](https://coveralls.io/repos/github/sghall/resonance/badge.svg?branch=master)](https://coveralls.io/github/sghall/resonance?branch=master)
[![Dependency Status](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0)
[![Greenkeeper badge](https://badges.greenkeeper.io/sghall/resonance.svg)](https://greenkeeper.io/)

## Installation


Resonance is available as an [npm package](https://www.npmjs.org/package/resonance).

```sh
npm install resonance
```

## Components

The main component of the library is the NodeGroup.  You can think of it as replacing d3's selection.data method which breaks your data array into entering, updating and exiting nodes.
Using Resonance you pass an array of data objects (at the moment, they have to be objects) into the NodeGroup and give it a key accessor function that returns a string key when passed a data object.
That key is used by React to keep track of what's mounted.

```sh
import NodeGroup from 'resonance/NodeGroup';
import Node from './Node';

<NodeGroup
  data={nodes}
  nodeComponent={Node}
  keyAccessor={keyAccessor}
/>
```

Inside your component you recieve the data object, index, type and a function to call to remove the node. 

In Resonance, the types are:

1. APPEAR ~= d3 enter
2. UPDATE ~= d3 update
3. REMOVE ~= d3 exit

You receive the type but you will rarely use it directly. Every time the data updates the NodeGroup updates its state and calls the appropriate method (if implemented) on your component for you.
It calls it in the context of your component so you have access to props, state, etc.

1. onAppear
2. onUpdate
3. onRemove

```sh
class Node extends Component {
  static propTypes = {
    data: PropTypes.object,
    index: PropTypes.number,
    removeNode: PropTypes.func,
  };

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

## Examples

Check out the [examples](https://sghall.github.io/resonance/)

To run the examples in this repo...

1. Clone the repo and cd into the directory
2. npm install
3. cd docs
4. npm install && npm start
4. go to http://localhost:3000/

## [Alluvial Chart](https://sghall.github.io/resonance/#/examples/alluvial-chart)
<a href="https://sghall.github.io/resonance/#/examples/alluvial-chart">
	<img src="https://cloud.githubusercontent.com/assets/4615775/24084023/d736ddde-0c9f-11e7-8646-b953dd368c84.jpg" height="250px"/>
</a>

## [Bar Chart](https://sghall.github.io/resonance/#/examples/states-by-age)
<a href="https://sghall.github.io/resonance/#/examples/states-by-age">
  <img src="https://cloud.githubusercontent.com/assets/4615775/24084025/d7397e86-0c9f-11e7-90b6-9a99f056f4c9.jpg" height="250px"/>
</a>

## [Circle Packing](https://sghall.github.io/resonance/#/examples/packed-by-age)
<a href="https://sghall.github.io/resonance/#/examples/packed-by-age">
  <img src="https://cloud.githubusercontent.com/assets/4615775/24084024/d7371ace-0c9f-11e7-8616-3941fd62aa55.jpg" height="250px"/>
</a>

## [Stacked Area](https://sghall.github.io/resonance/#/examples/stacked-area)
<a href="https://sghall.github.io/resonance/#/examples/stacked-area">
  <img src="https://cloud.githubusercontent.com/assets/4615775/24084030/de9ec4e2-0c9f-11e7-85d8-3be0bbc5c7d0.jpg" height="250px"/>
</a>

