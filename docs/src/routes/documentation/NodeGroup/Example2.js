// @flow weak
/* eslint react/no-multi-comp: "off" */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createNodeGroup from 'resonance/createNodeGroup';
import Surface from 'docs/src/components/Surface';
import { easeExpInOut } from 'd3-ease';
import { scaleBand } from 'd3-scale';
import { range } from 'd3-array';

const view = [1000, 350];      // [width, height]
const trbl = [50, 20, 50, 20]; // [top, right, bottom, left] margins

const dims = [ // Adjusted dimensions [width, height]
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
];

// **************************************************
//  Circle Component
// **************************************************
class Circle extends Component {
  static propTypes = {
    data: PropTypes.shape({
      x: PropTypes.number.isRequired,
    }).isRequired,
    scale: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    lazyRemove: PropTypes.func.isRequired,
  }

  state = {
    node: {
      opacity: 1e-6,
    },
    circle: {
      r: 1e-6,
      cx: this.props.scale(this.props.data.x) + (this.props.scale.bandwidth() / 2),
      fill: '#D2B362',
    },
  }

  onEnter() {
    const { scale, index, data: { x } } = this.props;

    return {
      node: {
        opacity: [1e-6, 0.4],
      },
      circle: {
        r: [1e-6, scale.bandwidth() / 2],
        cx: scale(x) + (scale.bandwidth() / 2),
        strokeWidth: [1e-6, index + 1],
        fill: '#D2B362',
      },
      timing: { duration: 1000, ease: easeExpInOut },
    };
  }

  onUpdate() {
    const { scale, index, data: { x } } = this.props;

    return {
      node: {
        opacity: [0.4],
      },
      circle: {
        r: [scale.bandwidth() / 2],
        cx: [scale(x) + (scale.bandwidth() / 2)],
        strokeWidth: [index + 1],
        fill: ['#634A8F'],
      },
      timing: { duration: 1000, ease: easeExpInOut },
    };
  }

  onExit() {
    const { lazyRemove } = this.props;

    return {
      node: {
        opacity: [1e-6],
      },
      circle: {
        fill: '#426F85',
      },
      timing: { duration: 1000, ease: easeExpInOut },
      events: { end: lazyRemove },
    };
  }

  render() {
    return (
      <g {...this.state.node}>
        <circle
          stroke="tomato"
          cy={dims[1] / 2}
          {...this.state.circle}
        />
      </g>
    );
  }
}

const CircleGroup = createNodeGroup(Circle, 'g', (d) => `key-${d.x}`);

// **************************************************
//  Example
// **************************************************
class Example2 extends Component {
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
      .padding(0.05)
      .domain(range(data.length));

    return (
      <div>
        <button onClick={this.update}>
          Update
        </button>
        <span style={{ margin: 5 }}>
          Circle Count: {data.length}
        </span>
        <Surface view={view} trbl={trbl}>
          <CircleGroup
            data={data}
            scale={scale}
          />
        </Surface>
      </div>
    );
  }
}

export default Example2;
