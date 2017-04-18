## Resonance

Data driven transitons in React.

Harnesses the awesome [d3-timer](https://github.com/d3/d3-timer) which can efficiently schedule 1000s of animated transitions.
Provides an interface for utilizing the various [d3 interpolaters](https://github.com/d3/d3-interpolate) to make state transitions.

The basic idea is that, while d3 stores data and schedules transitions against DOM nodes.  Resonance takes the same sheduling mechanism and much of the same tooling (d3 4.0 modules) and instead schedules transitions against your React components.
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

