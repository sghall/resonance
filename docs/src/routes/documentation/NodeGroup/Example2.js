// @flow weak
/* eslint react/no-multi-comp: "off" */

import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
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
//  Node Component
// **************************************************
class Node extends Component {
  static propTypes = {
    data: PropTypes.shape({
      x: PropTypes.number.isRequired,
    }).isRequired,
    scale: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
  }

  node = null // ref set in render
  circle = null // ref set in render

  onAppear() {
    const { scale, data: { x } } = this.props;

    return {
      node: {
        opacity: [1e-6, 0.4],
      },
      circle: {
        r: [1e-6, scale.bandwidth() / 2],
        cx: scale(x) + (scale.bandwidth() / 2),
        fill: '#D2B362',
      },
      timing: { duration: 1000, ease: easeExpInOut },
    };
  }

  onUpdate() {
    const { scale, data: { x } } = this.props;

    return {
      node: {
        opacity: [0.4],
      },
      circle: {
        r: [scale.bandwidth() / 2],
        cx: [scale(x) + (scale.bandwidth() / 2)],
        fill: ['#634A8F'],
      },
      timing: { duration: 1000, ease: easeExpInOut },
    };
  }

  onRemove() {
    const { removeNode } = this.props;

    return {
      node: {
        opacity: [1e-6],
      },
      circle: {
        fill: '#426F85',
      },
      timing: { duration: 1000, ease: easeExpInOut },
      events: { end: removeNode },
    };
  }

  render() {
    return (
      <g ref={(d) => { this.node = d; }}>
        <circle
          ref={(d) => { this.circle = d; }}
          stroke="grey"
          cy={dims[1] / 2}
        />
      </g>
    );
  }
}

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
        <RaisedButton
          label="Update"
          style={{ margin: 5 }}
          onClick={this.update}
        />
        <span>Circle Count: {data.length}</span>
        <Surface
          view={view}
          trbl={trbl}
          style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        >
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

export default Example2;
