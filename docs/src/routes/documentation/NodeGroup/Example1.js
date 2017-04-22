// @flow weak
/* eslint react/no-multi-comp: "off" */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
import { scaleBand } from 'd3-scale';
import { range } from 'd3-array';

const view = [1000, 250];      // [width, height]
const trbl = [10, 10, 10, 10]; // [top, right, bottom, left] margins

const dims = [ // Adjusted dimensions [width, height]
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
];

// **************************************************
//  Node Component
// **************************************************
class Node extends Component {
  static propTypes = {
    data: PropTypes.shape({
      x: PropTypes.number.isRequired,
    }).isRequired,
    scale: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }

  state = {
    node: {
      opacity: 1e-6,
    },
    rect: {
      x: this.props.scale(this.props.data.x),
      fill: 'tomato',
      width: this.props.scale.bandwidth(),
    },
  }

  onEnter() {
    const { scale, data: { x } } = this.props;

    return {
      node: {
        opacity: [1e-6, 0.6],
      },
      rect: {
        x: scale(x),
        fill: 'tomato',
        width: scale.bandwidth(),
      },
      timing: { duration: 1000 },
    };
  }

  onUpdate() {
    const { scale, data: { x } } = this.props;

    return {
      node: {
        opacity: [0.6],
      },
      rect: {
        x: [scale(x)],
        fill: ['#0000FF'],
        width: [scale.bandwidth()],
      },
      timing: { duration: 1000 },
    };
  }

  onRemove() {
    const { remove } = this.props;

    return {
      node: {
        opacity: [1e-6],
      },
      rect: {
        fill: 'fuchsia',
      },
      timing: { duration: 1000 },
      events: { end: remove },
    };
  }

  render() {
    return (
      <g {...this.state.node}>
        <rect
          height={dims[1]}
          {...this.state.rect}
        />
      </g>
    );
  }
}

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
    const { data } = this.state;

    const scale = scaleBand()
      .rangeRound([0, dims[0]])
      .padding(0.1)
      .domain(range(data.length));

    return (
      <div>
        <button onClick={this.update}>
          Update
        </button>
        <span style={{ margin: 5 }}>
          Bar Count: {data.length}
        </span>
        <Surface view={view} trbl={trbl}>
          <NodeGroup
            data={data}
            scale={scale}
            nodeComponent={Node}
          />
        </Surface>
      </div>
    );
  }
}

export default Example1;
