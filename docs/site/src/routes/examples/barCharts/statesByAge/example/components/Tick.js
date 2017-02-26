// @flow weak

import React, { Component, PropTypes } from 'react';
import { timer } from 'd3-timer';
import { format } from 'd3-format';
import { interpolateNumber, interpolateTransformSvg } from 'd3-interpolate';
import { APPEAR, UPDATE, REMOVE, REVIVE } from './withSelection';

const percentFormat = format('.1%');

export default class Tick extends Component {

  componentDidMount() {
    this.onAppear(this.props, this.refs);
  }

  componentWillReceiveProps(next) {
    const { props, refs } = this;

    if (props.tick !== next.tick) {
      this.transition.stop();

      switch (next.tick.type) {
        case APPEAR:
          this.onAppear(next, refs);
          break;
        case UPDATE:
          this.onUpdate(next, refs);
          break;
        case REMOVE:
          this.onRemove(next, refs);
          break;
        case REVIVE:
          this.onUpdate(next, refs);
          break;
        default:
          break;
      }
    }
  }

  componentWillUnmount() {
    this.transition.stop();
  }

  onAppear({ xScale0, xScale1, tick: { data }, duration }, { tick }) {
    const beg = `translate(${xScale0(data)},0)`;
    const end = `translate(${xScale1(data)},0)`;

    const interp0 = interpolateTransformSvg(beg, end);
    const interp1 = interpolateNumber(1e-6, 1);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;
      tick.setAttribute('transform', interp0(t));
      tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  onUpdate({ xScale0, xScale1, tick: { data }, duration }, { tick }) {
    const beg = `translate(${xScale0(data)},0)`;
    const end = `translate(${xScale1(data)},0)`;

    const interp0 = interpolateTransformSvg(beg, end);
    const interp1 = interpolateNumber(tick.getAttribute('opacity'), 1);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;

      tick.setAttribute('transform', interp0(t));
      tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  onRemove({ xScale0, xScale1, tick: { udid, data }, removeTick, duration }, { tick }) {
    const beg = `translate(${xScale0(data)},0)`;
    const end = `translate(${xScale1(data)},0)`;

    const interp0 = interpolateTransformSvg(beg, end);
    const interp1 = interpolateNumber(tick.getAttribute('opacity'), 1e-6);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;

      tick.setAttribute('transform', interp0(t));
      tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  render() {
    const { yHeight, node: { data } } = this.props;

    return (
      <g ref="tick" opacity={1e-6}>
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
};
