// @flow weak

import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
import { scaleBand } from 'd3-scale';
import { range } from 'd3-array';

const view = [1000, 250];
const trbl = [10, 10, 10, 10];

const dims = [
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
];

class Node extends Component {
  static propTypes = {
    data: PropTypes.shape({
      x: PropTypes.number.isRequired,
    }).isRequired,
    scale: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
  }

  node = null // ref set in render
  rect = null // ref set in render

  onAppear() {
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
    const { removeNode } = this.props;

    return {
      node: {
        opacity: [1e-6],
      },
      rect: {
        fill: 'fuchsia',
      },
      timing: { duration: 1000 },
      events: { end: removeNode },
    };
  }

  render() {
    return (
      <g ref={(d) => { this.node = d; }}>
        <rect
          ref={(d) => { this.rect = d; }}
          height={dims[1]}
        />
      </g>
    );
  }
}

class Exmaple1 extends Component {

  constructor(props) {
    super(props);

    (this:any).update = this.update.bind(this);
  }

  state = {
    data: range(10).map((d) => ({x: d})),
  }

  update() {
    const count = Math.ceil(Math.random() * 20);

    this.setState({
      data: range(count).map((d) => ({x: d})),
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
        <RaisedButton
          label="Update"
          style={{ margin: 5 }}
          onClick={this.update}
        />
        <span>Bar Count: {data.length}</span>
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

export default Exmaple1;
