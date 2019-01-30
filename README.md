## Resonance | Data-driven transitions in React

[![Build Status](https://travis-ci.org/sghall/resonance.svg?branch=master)](https://travis-ci.org/sghall/resonance)
[![Coverage Status](https://coveralls.io/repos/github/sghall/resonance/badge.svg?branch=master)](https://coveralls.io/github/sghall/resonance?branch=master)


## Resonance 1.0 Beta is almost here!

Resonance runs your react animations by manipulating the DOM for you. 

# Getting Started

Resonance exports just two factory functions:
- createNodeGroup => NodeGroup - If you have an **array of items** that enter, update and leave
- createAnimate => Animate - If you have a **singe item** that enters, updates and leaves

To get some components to work with in your app you can use this code to create them with some good defaults:


### The `getInterpolator` function

You can wire your components in `resonance` to handle different types of interpolation.  The code for interpolating strings or SVG paths can be bulky and, in many cases, it's not needed.

To wire up a full service set of components that will interpolate colors, paths, numbers and SVG transforms you can use a setup like this:

```
npm install resonance d3-interpolate
```

Then in your app:
```js
import { createNodeGroup, createAnimate } from 'resonance'
import { interpolate, interpolateTransformSvg } from 'd3-interpolate'

function getInterpolator(begValue, endValue, attr, namespace) {
  if (attr === 'transform') {
    return interpolateTransformSvg(begValue, endValue)
  }

  return interpolate(begValue, endValue)
}

export const NodeGroup = createNodeGroup(getInterpolator)
export const Animate = createAnimate(getInterpolator)
```
Then just import them in other components in your app.

 
The `interpolate` function exported from d3-interpolate does a great job of guessing what you're trying to do and handles it for you but it also includes a lot of code (e.g. d3-color) that may not be needed for your project. For example, if you are just interpolating numbers in your components you could replace all that code with just a simple a interpolation function.  Resonance will apply easing functions (see [d3-ease](https://github.com/d3/d3-ease)) to your transitions to get a variety of effects.  A basic numeric interpolator would look like this:

```js
import { createNodeGroup, createAnimate } from 'resonance'

const numeric = (beg, end) => {
  const a = +beg
  const b = +end - a
  
  return function(t) {
    return a + b * t
  } 
}

function getInterpolator(begValue, endValue, attr, namespace) {
  return numeric(begValue, endValue)
}

export const NodeGroupNumeric = createNodeGroup(getInterpolator)
export const AnimateNumeric = createAnimate(getInterpolator)
```

Your `getInterpolator` function should avoid a lot of logic and computation.  It will get called at high frequency when transitions fire in your components.  You get the begin and end values and what the attribute name (string) is.  You will also get the namespace string (less common) if you are using them in your state.  **See the sections below on starting states and transitions for more on attrs and namespaces.**

Of course you can create as many custom components as you want and organize them in a way that makes sense to you.  You can use any interpolation library or write your own. 

## Starting state

Before looking at the components it might be good to look at starting state.  You are going to be asked to define starting states for each item in your `NodeGroup` and `Animate` components. This is a key concept and probably the most error prone for developers working with Resonance.  The starting state for each item is always **an object with string or number leaves**.  The leaf keys are referred to as "attrs" as in "attribute."  There are also "namespaces" which are a purely organizational concept.

Two rules to live by for starting states:
- Don't use the strings "timing" or "events" as an attr or namespace.
- There should never be an array anywhere in your object.

Example starting state:
```js
// GOOD
{
  attr1: 100,
  attr2: 200,
  attr3: '#dadada'
}

// BAD
{
  attr1: [100], // NO ARRAYS
  attr2: 200,
  attr3: '#dadada'
}
```

A more concrete example might be:
```js
{
  opacity: 0.1,
  x: 200,
  y: 100,
  color: '#dadada'
}
```

You can add "namespaces" to help organize your state:
```js
{
  attr1: 100,
  attr2: 200,
  attr3: '#ddaabb',
  namespace1: {
    attr1: 100,
    attr2: 200
  }
}
```
Or something like:
```js
{
  namespace1: {
    attr1: 100,
    attr2: 200
  },
  namespace2: {
    attr1: 100,
    attr2: 200
  }
}
```
You might use namespaces like so:
```js
{
  inner: {
    x: 100,
    y: 150,
    color: '#545454'
  },
  outer: {
    x: 300,
    y: 350,
    color: '#3e3e3e'
  }
}
```

#### Starting state in NodeGroup

In `NodeGroup` you are working with an array of items and you pass a start prop (a function) that receives the data item and its index.  The start prop will be called when that data item (identified by its key) enters.  Note it could leave and come back and that prop will be called again.  Immediately after the starting state is set your enter transition (optional) is called allowing you to transform that state.

```js
<NodeGroup
  data={data} // an array (required)
  keyAccessor={item => item.name} // function to get the key of each object (required)
  start={(item, index) => ({ // returns the starting state of node (required)
    ...
  })}
>
  ...children
</NodeGroup>
```

#### Starting state in Animate

In `Animate` you are animating a single item and pass a start prop that is an object or a function.  The start prop will be called when that the item enters.  Note it could leave and come back by toggling the show prop.  Immediately after the starting state is set your enter transition (optional) is called allowing you to transform that state.

```js
<Animate
  start={{ // object or function
    ...
  }}
>
 ...children
</Animate>
```

## Transitioning state

You return an object or an array of config objects in your **enter**, **update** and **leave** props functions for both `NodeGroup` and `Animate`. Instead of simply returning the next state these objects describe how to transform the state. Each config object can specify its own duration, delay, easing and events independently.

There are two special keys you can use: **timing** and **events**. Both are optional.
Timing and events are covered in more detail below.

If you aren't transitioning anything then it wouldn't make sense to be using NodeGroup.
That said, it's convenient to be able to set a key to value when a node enters, updates or leaves without transitioning.
To support this you can return four different types of values to specify how you want to transform the state.

* `string or number`: Set the key to the value immediately with no transition.  Ignores all timing values.

* `array [value]`: Transition from the key's current value to the specified value. Value is a string or number.

* `array [value, value]`: Transition from the first value to the second value. Each value is a string or number.

* `function`: Function will be used as a custom tween function.


Example config object:
```js
{
  attr1: [200],
  attr2: 300,
  attr3: ['#dadada']
  timing: { duration: 300, delay: 100 }
}
```

Using namespaces:
```js
{
  attr1: [100],
  attr3: '#ddaabb',
  namespace1: {
    attr1: [300],
    attr2: 200
  },
  timing: { duration: 300, delay: 100 }
}
```

To have different timing for some keys use an array of config objects:
```js
[
  {
    attr1: [200, 500],
    timing: { duration: 300, delay: 100 }
  },
  {
    attr2: 300, // this item, not wrapped in an array, will be set immediately, so which object it's in doesn't matter
    attr3: ['#dadada']
    timing: { duration: 600 }
  },
]
```

### Example Transitions in NodeGroup

```js
<NodeGroup
  data={this.state.data}
  keyAccessor={(d) => d.name}

  start={(data, index) => ({
    opacity: 1e-6,
    x: 1e-6,
    fill: 'green',
    width: scale.bandwidth(),
  })}

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
  ...children
</NodeGroup>
```

Using an array of config objects:
```js
import { easeQuadInOut } from 'd3-ease';

...

<NodeGroup
  data={this.state.data}
  keyAccessor={(d) => d.name}

  start={(data, index) => ({
    opacity: 1e-6,
    x: 1e-6,
    fill: 'green',
    width: scale.bandwidth(),
  })}

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
  ...children
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
  ease: easeLinear
};
```

For the ease key, just provide the function. You can use any easing function, like those from d3-ease...

[List of ease functions exported from d3-ease](https://github.com/d3/d3-ease/blob/master/index.js)

## Events

You can add events on your config objects.  You can pass a function that will run when the transition starts, is interrupted (an update to the data occurs) or ends.

Using Events:
```js
{
  attr1: [100],
  attr3: '#ddaabb',
  namespace1: {
    attr1: [300],
    attr2: 200
  },
  timing: { duration: 300, delay: 100 },
  events: {
    start: () => {
      ..do stuff - use an arrow function to keep the context of the outer component
    },
    interrupt: () => {
      ..do stuff - use an arrow function to keep the context of the outer component
    },
    end: () => {
      ..do stuff - use an arrow function to keep the context of the outer component
    },
  }
}
```

## < NodeGroup />

### Component Props

| Name                                               | Type     | Default  | Description                                                                                                                                                                              |
| :------------------------------------------------- | :------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span style="color: #31a148">data \*</span>        | Array    |          | An array of data objects. The data prop is treated as immutable so the nodes will only update if prev.data !== next.data.                                                                |
| <span style="color: #31a148">keyAccessor \*</span> | function |          | Function that returns a string key given a data object and its index. Used to track which nodes are entering, updating and leaving.                                                      |
| <span style="color: #31a148">start \*</span>       | function |          | A function that returns the starting state. The function is passed the data and index and must return an object.                                                                         |
| enter                                              | function | () => {} | A function that **returns an object or array of objects** describing how the state should transform on enter. The function is passed the data and index.                                 |
| update                                             | function | () => {} | A function that **returns an object or array of objects** describing how the state should transform on update. The function is passed the data and index.                                |
| leave                                              | function | () => {} | A function that **returns an object or array of objects** describing how the state should transform on leave. The function is passed the data and index.                                 |
| <span style="color: #31a148">children \*</span>    | function |          | A function that renders the nodes. It should accept an array of nodes as its only argument. Each node is an object with the key, data, state and a type of 'ENTER', 'UPDATE' or 'LEAVE'. |

* required props

## < Animate />

### Component Props

| Name | Type | Default | Description |
|:-----|:-----|:-----|:-----|
| show | bool | true |  Boolean value that determines if the child should be rendered or not. |
| <span style="color: #31a148">start *</span> | union:<br>&nbsp;func<br>&nbsp;object<br> |  |  An object or function that returns an obejct to be used as the starting state. |
| enter | union:<br>&nbsp;func<br>&nbsp;array<br>&nbsp;object<br> |  |  An object, array of objects, or function that returns an object or array of objects describing how the state should transform on enter. |
| update | union:<br>&nbsp;func<br>&nbsp;array<br>&nbsp;object<br> |  |  An object, array of objects, or function that returns an object or array of objects describing how the state should transform on update. ***Note:*** although not required, in most cases it make sense to specify an update prop to handle interrupted enter and leave transitions. |
| leave | union:<br>&nbsp;func<br>&nbsp;array<br>&nbsp;object<br> |  |  An object, array of objects, or function that returns an object or array of objects describing how the state should transform on leave. |
| <span style="color: #31a148">children *</span> | function |  |  A function that renders the node.  The function is passed the data and state. |

* required props

## Contributing

Contributions are welcome!  Before starting on a PR, open up an issue to discuss your idea.

#### Run the repo locally

* Fork this repo
* `npm install`
* `cd docs`
* `npm install`
* `npm start`

#### Scripts

Run these from the root of the repo

* `npm run lint` Lints all files in src and docs
* `npm run test` Runs the test suite locally
* `npm run test:coverage` Get a coverage report in the console
* `npm run test:coverage:html` Get an HTML coverage report in coverage folder


