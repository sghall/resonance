## Resonance | Data-driven transitions in React

[![Build Status](https://travis-ci.org/sghall/resonance.svg?branch=master)](https://travis-ci.org/sghall/resonance)
[![Coverage Status](https://coveralls.io/repos/github/sghall/resonance/badge.svg?branch=master)](https://coveralls.io/github/sghall/resonance?branch=master)
[![Dependency Status](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0)
![](http://img.badgesize.io/sghall/resonance/blob/gh-pages/dist/resonance.min.js.svg?label=minified)
![](http://img.badgesize.io/sghall/resonance/blob/gh-pages/dist/resonance.js.svg?compression=gzip)

An experimental library for animated state transitions that update with your data. 
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

[Documentation/Live Examples](https://sghall.github.io/resonance/#/documentation/node-group)


## Example Donut Chart

You can produce an animated donut chart with labels like the one below...

<a href="https://sghall.github.io/resonance/#/documentation/node-group">
  <img src="https://user-images.githubusercontent.com/4615775/26999680-7e327a18-4d54-11e7-8e86-7e4e548594ba.png" height="350px"/>
</a>

With a small amount of code like this...

```js
<NodeGroup
  data={arcs}
  keyAccessor={(d) => d.data.name}

  start={({ startAngle }) => ({
    startAngle,
    endAngle: startAngle,
  })}

  enter={({ endAngle }) => ({
    endAngle: [endAngle],
    timing: { duration: 1000, delay: 800 },
  })}

  update={({ startAngle, endAngle }) => ({
    startAngle: [startAngle],
    endAngle: [endAngle],
    timing: { duration: 1000 },
  })}
>
  {(nodes) => {
    return (
      <g>
        {nodes.map(({ key, data, state }) => {
          const p1 = outerArcPath.centroid(state);
          const p2 = [
            mid(state) ? p1[0] + (radius * 0.5) : p1[0] - (radius * 0.5),
            p1[1],
          ];
          return (
            <g key={key}>
              <path
                d={innerArcPath(state)}
                fill={colors(data.data.name)}
                opacity={0.9}
              />
              <text
                dy="4px"
                fontSize="12px"
                transform={`translate(${p2})`}
                textAnchor={mid(state) ? 'start' : 'end'}
              >{data.data.name}</text>
              <polyline
                fill="none"
                stroke="rgba(127,127,127,0.5)"
                points={`${innerArcPath.centroid(state)},${p1},${p2}`}
              />
            </g>
          );
        })}
      </g>
    );
  }}
</NodeGroup>
```
The full code for this donut chart example can be seen [here](https://sghall.github.io/resonance/#/documentation/node-group).

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
