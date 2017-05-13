## Resonance | Data-driven transitions in React

[![Build Status](https://travis-ci.org/sghall/resonance.svg?branch=master)](https://travis-ci.org/sghall/resonance)
[![Coverage Status](https://coveralls.io/repos/github/sghall/resonance/badge.svg?branch=master)](https://coveralls.io/github/sghall/resonance?branch=master)
[![Dependency Status](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0)
![](http://img.badgesize.io/sghall/resonance/gh-pages/dist/resonance.min.js.svg?label=minified)
![](http://img.badgesize.io/sghall/resonance/gh-pages/dist/resonance.js.svg?compression=gzip)

Animated state transitions that update with your data. 
This library uses [d3-timer](https://github.com/d3/d3-timer) to efficiently manage thousands of state tweens.
You can apply high-performance state animations using an approachable, easy to implement syntax.
[Get Started](https://sghall.github.io/resonance/#/documentation/node-group).

## Installation

Resonance is available as an [npm package](https://www.npmjs.org/package/resonance).

```sh
npm install resonance
```

## NodeGroup  

The NodeGroup component allows you to create complex animated transitions.  You pass it an array of objects and a key accessor function and it will run your enter, update and leave transitions as the data updates.
The idea is similar to transition components like [react-transition-group](https://github.com/reactjs/react-transition-group) or [react-motion's TransitionMotion](https://github.com/chenglou/react-motion) but you use objects to express how you want your state to transition.
Not only can you can have independent duration, delay and easing for entering, updating and leaving but each individual key in your state can define its own timing.

[Documentation/Live Examples](https://sghall.github.io/resonance/#/documentation/node-group)
```js
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
    g: {
      opacity: [0.4],
      transform: [`translate(${scale(data.name) + (scale.bandwidth() / 2)},0)`],
    },
    circle: {
      r: [scale.bandwidth() / 2],
      strokeWidth: [(index + 1) * 2],
      fill: 'blue',
    },
    timing: { duration: 1000, ease: easeExpInOut },
  })}

  leave={(data, index, remove) => ({
    g: {
      opacity: [1e-6],
    },
    circle: {
      fill: 'red',
    },
    timing: { duration: 1000, ease: easeExpInOut },
    events: { end: remove },
  })}

  render={(data, state) => {
    return (
      <g {...state.g}>
        <circle
          stroke="grey"
          cy={dims[1] / 2}
          {...state.circle}
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
  }}
/>
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
