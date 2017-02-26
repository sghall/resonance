// @flow weak

import React, { Component, PropTypes } from 'react';
import { AxisTick } from './AxisTick';

export class TickGroup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ticks: props.xScale.ticks(),
      xScale0: props.xScale,
      xScale1: props.xScale,
    };
  }

  componentWillReceiveProps({ xScale }) {
    if (this.props.xScale !== xScale) {
      this.setState({
        ticks: xScale.ticks(),
        xScale0: this.props.xScale,
        xScale1: xScale,
      });
    }
  }

  render() {
    const { state: { ticks, xScale0, xScale1 }, props: { duration, yScale } } = this;

    const ticks = Object.keys(mounted).map((key) => {
      const tick = mounted[key];
      return (
        <AxisTick
          key={key} tick={tick}
          xScale0={xScale0}
          xScale1={xScale1}
          yHeight={yScale.range()[1]}
          duration={duration}
          removeTick={this.removeTick}
        />
      );
    });

    return (
      <g>{ticks}</g>
    );
  }
}

TickGroup.propTypes = {
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  format: PropTypes.func.isRequired,
  duration: PropTypes.number.isRequired,
};
