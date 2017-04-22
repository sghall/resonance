## Resonance | Data-Driven Transitions in React

[![Build Status](https://travis-ci.org/sghall/resonance.svg?branch=master)](https://travis-ci.org/sghall/resonance)
[![Coverage Status](https://coveralls.io/repos/github/sghall/resonance/badge.svg?branch=master)](https://coveralls.io/github/sghall/resonance?branch=master)
[![Dependency Status](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58cf12fc6893fd004792c7d0)
[![Greenkeeper badge](https://badges.greenkeeper.io/sghall/resonance.svg)](https://greenkeeper.io/)

An experimental library that uses [d3-timer](https://github.com/d3/d3-timer) to transition the state of your React components. 
Documentation and examples are a work in progress. PRs/feedback/comments/suggestions welcome.

Take a look at the [Webpack bundle for Resonance](https://sghall.github.io/resonance/#/examples/webpack-sunburst) to see what's inside.

<a href="https://sghall.github.io/resonance/#/examples/webpack-sunburst">
  <img src="https://cloud.githubusercontent.com/assets/4615775/25240281/45acec66-25a7-11e7-9e6a-83012473b748.png" height="300px"/>
</a>

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

## Why would I need this?

Resonance handles much of the heavy lifting for:

* Transitioning numbers, strings, colors, SVG transforms...
* Setting transition durations and delays
* Transition interrupts
* Hooks for transition events (start, interrupt, end)
* Custom tween functions
* Specifying ease functions
* Stopping transitions on component unmount

