## Resonance | Data-driven transitions in React

[![Build Status](https://travis-ci.org/sghall/resonance.svg?branch=master)](https://travis-ci.org/sghall/resonance)
[![Coverage Status](https://coveralls.io/repos/github/sghall/resonance/badge.svg?branch=master)](https://coveralls.io/github/sghall/resonance?branch=master)
[![Dependency Status](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0)
![](http://img.badgesize.io/sghall/resonance/gh-pages/fileSize/resonance.min.js?label=minified)
![](http://img.badgesize.io/sghall/resonance/gh-pages/fileSize/resonance.min.js?compression=gzip)

React components for animated state transitions that update with your data. 
This library uses [d3-timer](https://github.com/d3/d3-timer) to efficiently manage thousands of state tweens.
You can apply high-performance state animations using an approachable, easy to implement syntax.

[Get Started](https://sghall.github.io/resonance/#/documentation/node-group)

## Installation

Resonance is available as an [npm package](https://www.npmjs.org/package/resonance).

```sh
npm install resonance
```

## NodeGroup  

The NodeGroup component allows you to create complex animated transitions.  You pass it an array of objects and a key accessor function and it will run your enter, update and leave transitions as the data updates.
The idea is similar to transition components like [react-transition-group](https://github.com/reactjs/react-transition-group) or [react-motion's TransitionMotion](https://github.com/chenglou/react-motion) but you use objects to express how you want your state to transition.
Not only can you can have independent duration, delay and easing for entering, updating and leaving but each individual key in your state can define its own timing.

<a href="https://sghall.github.io/resonance/#/documentation/node-group">
  <img src="https://user-images.githubusercontent.com/4615775/27489448-6ab3ed14-57ef-11e7-871e-a1fb621f2d96.png" height="500px"/>
</a>

### Usage

A typical usage of NodeGroup looks like this...

```js
<NodeGroup
  data={this.state.data} // array of data objects (required)
  keyAccessor={(d) => d.name} // function to get the key of each object (required)

  start={(data, index) => ({ // returns the starting state of node (required)
    ...
  })}

  enter={(data, index) => ({ // how to transform node state on enter - runs immediately after start (optional)
    ...
  })}

  update={(data, index) => ({ // how to transform node state on update - runs each time data updates and key remains (optional)
    ...
  })}

  leave={(data, index) => ({ // how to transform node state on leave - run when data updates and key is gone (optional)
    ...
  })}
>
  {(nodes) => ( // the only child of NodeGroup should be a function to render the nodes (required)
    ...
      {nodes.map(({ key, data, state }) => {
        ...
      })}
    ...
  )}
</NodeGroup>
```

### Transitions

You return an object or an array of objects in your **enter**, **update** and **leave** functions.
Instead of simply returning the next state these objects describe how to transform the state.
This is far more powerful than just returning a state object.  By approaching it this way, you can describe really complex transformations and handle interrupts easily.

If you're familiar with D3, this approach mimics selection/transition behavior.  In D3 your are really describing how the state should look on enter, update and exit and how to get there: set the value immediately or transition to it.
D3 deals with the fact that transitions might be in-flight or the key is already at that value in the background without you having to worry about that.
The NodeGroup takes the same approach but it's done in idiomatic React.

Each object returned from your enter, update and leave functions can specify its own duration, delay, easing and events independently.
To support that, inside your object there are two special keys you can use:  **timing** and **events**.  Both are optional.
Timing and events are covered in more detail below.
The rest of the keys in each object are assumed to be keys in your state.

If you aren't transitioning anything then it wouldn't make sense to be using NodeGroup.
That said, like in D3, it's also convenient to be able to set a key to value when a node enters, updates or leaves without transitioning.
To support this you can return four different types of values to specify how you want to transform the state.

* `string or number`: Set the key to the value immediately with no transition.

* `array [value]`: Transition from the key's current value to the specified value. Value is a string or number.

* `array [value, value]`: Transition from the first value to the second value. Each value is a string or number.

* `function`: Function will be used as a custom tween function.

In all cases above a "string" can be a color, path, transform (the key must be called "transform" see below), etc and it will be interpolated using the correct interpolator.
See the interpolators section below.

```js
<NodeGroup
  data={this.state.data}
  keyAccessor={(d) => d.name}

  // start - starting state of the node. Just return an object.
  start={(data, index) => ({
    opacity: 1e-6,
    x: 1e-6,
    fill: 'green',
    width: scale.bandwidth(),
  })}

  // enter - return an object or array of objects describing how to transform the state.
  enter={(data, index) => ({
    opacity: [0.5], // transition opacity on enter
    x: [scale(data.name)], // transition x on on enter
    timing: { duration: 1500 }, // timing for transitions
  })}

  update={(data) => ({
    ...
  })}

  leave={() => ({
    ...
  })}
>
  {(nodes) => (
    ...
  )}
</NodeGroup>
```

## Timing

If there's no timing key in your object you'll get the timing defaults.
You can specify just the things you want to override on your timing key. 

Here's the timing defaults...
```js
const defaultTiming = {
  delay: 0,
  duration: 250,
  ease: easeLinear,
};
```
For the ease key, just provide the function.  You can use any easing function, like those from d3-ease...

[List of ease functions exported from d3-ease](https://github.com/d3/d3-ease/blob/master/index.js)

## Passing an array of objects

Each object can define its own timing and it will be applied to any transitions in the object.

```js
import { easeQuadInOut } from 'd3-ease';

...

<NodeGroup
  data={this.state.data}
  keyAccessor={(d) => d.name}

  // start - starting state of the node. Just return an object.
  start={(data, index) => ({
    opacity: 1e-6,
    x: 1e-6,
    fill: 'green',
    width: scale.bandwidth(),
  })}

  // enter - return an object or array of objects describing how to transform the state.
  enter={(data, index) => ([ // An array
    {
      opacity: [0.5], // transition opacity on enter
      timing: { duration: 1000 }, // timing for transition
    },
    {
      x: [scale(data.name)], // transition x on on enter
      timing: { delay: 750, duration: 1500, ease: easeQuadInOut }, // timing for transition
    },
  ])}

  update={(data) => ({
    ...
  })}

  leave={() => ({
    ...
  })}
>
  {(nodes) => (
    ...
  )}
</NodeGroup>
```

## Events

The events are the same as those on D3 transitions. You can fire a function on transition start, interrupt or end.
```js
<NodeGroup
  data={this.state.data}
  keyAccessor={(d) => d.name}

  start={() => ({
    ...
  })}

  enter={(data) => ({
    ...
  })}

  update={(data) => ({
    opacity: [0.5],
    x: [scale(data.name)],
    fill: 'blue',
    width: [scale.bandwidth()],
    timing: { duration: 1500, ease: easeQuadInOut },
    events: {
      start() { // runs in the context of the node
        console.log('start!', data, this); 
      },
      interrupt() { // runs in the context of the node
        console.log('interrupt!', data, this);
      },
      end() { // runs in the context of the node
        console.log('end!', data, this);
        this.setState({ fill: 'tomato' }); // the node has a setState method on it!
      },
    },
  })}

  leave={() => ({
    ...
  })}
>
  {(nodes) => (
    ...
  )}
</NodeGroup>
```

## Interpolators

Interpolators are inferred from what you specify in your transition object.

With the exceptions of "events" and "timing" you can name the keys that are transitioning whatever you want, but if you use the key "transform" it indicates that you want to use D3's SVG transform interpolator.
Beyond that, the value will determine the interpolator.  This is essentailly how D3 picks interpolators.

The logic is as follows:
1. If the value is a function, it will be used as a custom tween function.
2. Then the key and value are passed to the function below:

```js
import {
  interpolateRgb,
  interpolateNumber,
  interpolateString,
  interpolateTransformSvg,
} from 'd3-interpolate';
import { color } from 'd3-color';

export function getInterpolator(key, value) {
  if (key === 'transform') {
    return interpolateTransformSvg;
  } else if (typeof value === 'number') {
    return interpolateNumber;
  } else if (value instanceof color || color(value) !== null) {
    return interpolateRgb;
  }

  return interpolateString;
}
```

## Namespacing your state

You don't have to keep your state flat either.
You can create "namespaces" that allow you to organize state in a way that makes sense for your component. In the example below, you can get sense of how this works.
To see the full code and a live demo go to examples section of the docs site.

What's nice about this is you can then just spread your state in the render function:
```js
...

<NodeGroup
  data={this.state.data}
  keyAccessor={(d) => d.name}

  start={() => ({
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

  enter={(data, index) => ({
    g: {
      opacity: [0.4],
      transform: [`translate(${scale(data.name) + (scale.bandwidth() / 2)},0)`],
    },
    circle: {
      r: [scale.bandwidth() / 2],
      strokeWidth: [(index + 1) * 2],
      fill: 'green',
    },
    timing: { duration: 1000, ease: easeExpInOut },
  })}

  update={(data, index) => ({
    ...
  })}

  leave={() => ({
    ...
  })}
>
  {(nodes) => {
    return (
      <g>
        {nodes.map(({ key, data, state }) => {
          return (
            <g key={key} {...state.g}> // spread the g object
              <circle
                stroke="grey"
                cy={dims[1] / 2}
                {...state.circle} // spread the circle object
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
              >{`name: ${data.name}`}</text>
            </g>
          );
        })}
      </g>
    );
  }}
</NodeGroup>

...
```
## Why would I need this?

**Resonance handles much of the heavy lifting for...**
* Create custom transitions easily
* Animate HTML, SVG, React-Native components...
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

You can animate anything with Resonance, but it was developed by experimenting with animated SVG charts and redux.
This library is great for creating abstact animated data visualizations in React.
You can view the [example code](https://github.com/sghall/resonance/tree/master/docs/src/routes/reduxExamples) here for the chart examples.
Each example is a mini [redux](http://redux.js.org/) application with its actions and reducers defined in a small module.
You can run these examples locally by following the direction above.

<a href="https://sghall.github.io/resonance/#/redux-examples/webpack-sunburst">
  <img src="https://cloud.githubusercontent.com/assets/4615775/25240281/45acec66-25a7-11e7-9e6a-83012473b748.png" height="150px"/>
</a>
<a href="https://sghall.github.io/resonance/#/redux-examples/alluvial-chart">
  <img src="https://cloud.githubusercontent.com/assets/4615775/24084023/d736ddde-0c9f-11e7-8646-b953dd368c84.jpg" height="150px"/>
</a>
<a href="https://sghall.github.io/resonance/#/redux-examples/states-by-age">
  <img src="https://cloud.githubusercontent.com/assets/4615775/24084025/d7397e86-0c9f-11e7-90b6-9a99f056f4c9.jpg" height="150px"/>
</a>
<a href="https://sghall.github.io/resonance/#/redux-examples/packed-by-age">
  <img src="https://cloud.githubusercontent.com/assets/4615775/24084024/d7371ace-0c9f-11e7-8616-3941fd62aa55.jpg" height="150px"/>
</a>
<a href="https://sghall.github.io/resonance/#/redux-examples/stacked-area">
  <img src="https://cloud.githubusercontent.com/assets/4615775/24084030/de9ec4e2-0c9f-11e7-85d8-3be0bbc5c7d0.jpg" height="150px"/>
</a>
