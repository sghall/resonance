import React, { Component, PropTypes } from 'react';
import { timer } from 'd3-timer';
import { interpolateNumber, interpolateTransformSvg } from 'd3-interpolate';

export class AxisTick extends Component {

  componentDidMount() {
    this.isEntering(this.props, this.refs);
  }

  componentWillReceiveProps(next) {
    let {props, refs} = this;

    if (props.tick !== next.tick) {
      this.transition.stop();

      switch (next.tick.type) {
      case 'ENTERING':
        return this.isEntering(next, refs);
      case 'UPDATING':
        return this.isUpating(next, refs);
      case 'EXITING':
        return this.isExiting(next, refs);
      default:
        throw new Error('Invalid Tick Type!');
      }
    }
  }

  isEntering({xScale0, xScale1, tick: {data}, duration}, {tick}) {
    let beg = `translate(${xScale0(data)},0)`;
    let end = `translate(${xScale1(data)},0)`;

    let interp0 = interpolateTransformSvg(beg, end);
    let interp1 = interpolateNumber(1e-6, 1);

    this.transition = timer(elapsed => {
      let t = elapsed < duration ? (elapsed / duration): 1;
      tick.setAttribute('transform', interp0(t));
      tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  isUpating({xScale0, xScale1, tick: {data}, duration}, {tick}) {
    let beg = `translate(${xScale0(data)},0)`;
    let end = `translate(${xScale1(data)},0)`;

    let interp0 = interpolateTransformSvg(beg, end);
    let interp1 = interpolateNumber(tick.getAttribute('opacity'), 1);

    this.transition = timer(elapsed => {
      let t = elapsed < duration ? (elapsed / duration): 1;

      tick.setAttribute('transform', interp0(t));
      tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  isExiting({xScale0, xScale1, tick: {udid, data}, removeTick, duration}, {tick}) {
    let beg = `translate(${xScale0(data)},0)`;
    let end = `translate(${xScale1(data)},0)`;

    let interp0 = interpolateTransformSvg(beg, end);
    let interp1 = interpolateNumber(tick.getAttribute('opacity'), 1e-6);

    this.transition = timer(elapsed => {
      let t = elapsed < duration ? (elapsed / duration): 1;

      tick.setAttribute('transform', interp0(t));
      tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
        removeTick(udid);
      }
    });
  }

  componentWillUnmount() {
    this.transition.stop();
  }

  render() {
    let {yHeight, tick: {text}} = this.props;

    return (
      <g ref='tick' opacity={1e-6}>
        <line
          style={{pointerEvents: 'none'}}
          x1={0} y1={0}
          x2={0} y2={yHeight}
          opacity={0.2}
          stroke='#fff'
        />
        <text
          fontSize={'9px'}
          textAnchor='middle'
          fill='white'
          x={0} y={-5} 
        >{text}</text>
      </g>
    );
  }
}

AxisTick.propTypes = {
  tick: PropTypes.shape({
    udid: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    data: React.PropTypes.number.isRequired,
    text: React.PropTypes.string.isRequired
  }).isRequired,
  xScale0: PropTypes.func.isRequired,
  xScale1: PropTypes.func.isRequired,
  yHeight: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  removeTick: PropTypes.func.isRequired
};
