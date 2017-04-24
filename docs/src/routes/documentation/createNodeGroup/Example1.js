// @flow weak
/* eslint react/no-multi-comp: "off" */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createNodeGroup from 'resonance/createNodeGroup';
import Surface from 'docs/src/components/Surface';
import { scaleBand } from 'd3-scale';
import { range } from 'd3-array';

const view = [1000, 250];      // [width, height]
const trbl = [10, 10, 10, 10]; // [top, right, bottom, left] margins

const dims = [ // Adjusted dimensions [width, height]
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
];

// **************************************************
//  Bar Component
// **************************************************
class Bar extends Component {
  static propTypes = {
    data: PropTypes.shape({
      x: PropTypes.number.isRequired,
    }).isRequired,
    scale: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }

  state = {
    opacity: 1e-6,
    x: this.props.scale(this.props.data.x),
    fill: 'tomato',
    width: this.props.scale.bandwidth(),
  }

  onEnter = () => ({
    opacity: [1e-6, 0.6],
    x: this.props.scale(this.props.data.x),
    fill: 'tomato',
    width: this.props.scale.bandwidth(),
    timing: { duration: 500 },
  })

  onUpdate = () => ({
    opacity: [0.6],
    x: [this.props.scale(this.props.data.x)],
    fill: ['#0000FF'],
    width: [this.props.scale.bandwidth()],
    timing: { duration: 1000 },
  })

  onExit = () => ({
    opacity: [1e-6],
    fill: 'fuchsia',
    timing: { duration: 500 },
    events: { end: this.props.remove },
  })

  render() {
    return (
      <rect
        height={dims[1]}
        {...this.state}
      />
    );
  }
}

const BarGroup = createNodeGroup(Bar, 'g', (d) => `key-${d.x}`);

// **************************************************
//  Example
// **************************************************
class Example1 extends Component {
  constructor(props) {
    super(props);
    (this:any).update = this.update.bind(this);
  }

  state = {
    data: range(10).map((d) => ({ x: d })),
  }

  update() {
    const count = Math.ceil(Math.random() * 20);

    this.setState({
      data: range(count).map((d) => ({ x: d })),
    });
  }

  render() {
    const scale = scaleBand()
      .rangeRound([0, dims[0]])
      .padding(0.1)
      .domain(range(this.state.data.length));

    return (
      <div>
        <button onClick={this.update}>
          Update
        </button>
        <span style={{ margin: 5 }}>
          Bar Count: {this.state.data.length}
        </span>
        <Surface view={view} trbl={trbl}>
          <BarGroup
            data={this.state.data}
            scale={scale}
          />
        </Surface>
      </div>
    );
  }
}

export default Example1;
