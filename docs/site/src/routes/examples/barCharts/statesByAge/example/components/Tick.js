// @flow weak

import React, { Component, PropTypes } from 'react';
import { timer } from 'd3-timer';
import { format } from 'd3-format';
import { interpolateNumber, interpolateTransformSvg } from 'd3-interpolate';
import { APPEAR, UPDATE, REMOVE, REVIVE } from './withSelection';

const percentFormat = format('.1%');

export default class Tick extends Component {

  componentDidMount() {
    this.onAppear(this.props);
  }

  componentWillReceiveProps(next) {
    const { props } = this;

    if (props.node !== next.node) {
      this.transition.stop();

      switch (next.node.type) {
        case APPEAR:
          this.onAppear(next);
          break;
        case UPDATE:
          this.onUpdate(next);
          break;
        case REMOVE:
          this.onRemove(next);
          break;
        case REVIVE:
          this.onUpdate(next);
          break;
        default:
          break;
      }
    }
  }

  componentWillUnmount() {
    this.transition.stop();
  }

  onAppear({ xScale0, xScale1, node: { data }, duration }) {
    const beg = `translate(${xScale0(data)},0)`;
    const end = `translate(${xScale1(data)},0)`;

    const interp0 = interpolateTransformSvg(beg, end);
    const interp1 = interpolateNumber(1e-6, 1);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;
      this.tick.setAttribute('transform', interp0(t));
      this.tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  onUpdate({ xScale1, node: { data }, duration }) {
    const beg = this.tick.getAttribute('transform');
    const end = `translate(${xScale1(data)},0)`;

    const interp0 = interpolateTransformSvg(beg, end);
    const interp1 = interpolateNumber(this.tick.getAttribute('opacity'), 1);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;

      this.tick.setAttribute('transform', interp0(t));
      this.tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  onRemove({ xScale1, node: { data }, duration, removeNode }) {
    const beg = this.tick.getAttribute('transform');
    const end = `translate(${xScale1(data)},0)`;

    const interp0 = interpolateTransformSvg(beg, end);
    const interp1 = interpolateNumber(this.tick.getAttribute('opacity'), 1e-6);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;

      this.tick.setAttribute('transform', interp0(t));
      this.tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
        removeNode();
      }
    });
  }

  render() {
    const { yHeight, node: { data } } = this.props;

    return (
      <g ref={(d) => { this.tick = d; }}>
        <line
          style={{ pointerEvents: 'none' }}
          x1={0} y1={0}
          x2={0} y2={yHeight}
          opacity={0.2}
          stroke="#fff"
        />
        <text
          fontSize="9px"
          textAnchor="middle"
          fill="white"
          x={0} y={-5}
        >{percentFormat(data)}</text>
      </g>
    );
  }
}

Tick.propTypes = {
  node: PropTypes.shape({
    udid: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    data: React.PropTypes.number.isRequired,
  }).isRequired,
  xScale0: PropTypes.func.isRequired,
  xScale1: PropTypes.func.isRequired,
  yHeight: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  removeNode: PropTypes.func.isRequired,
};
