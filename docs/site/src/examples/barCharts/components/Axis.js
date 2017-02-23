// @flow weak

import React, { Component, PropTypes } from 'react';
import { AxisTick } from './AxisTick';

export class Axis extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mounted: {},
      xScale0: null,
      xScale1: null,
    };

    this.removeTick = this.removeTick.bind(this);
  }

  componentDidMount() {
    const { props, state } = this;
    this.removed = {};
    this.update(props, props, state);
  }

  componentWillReceiveProps(next) {
    const { props, state } = this;
    if (this.props.xScale !== next.xScale) {
      this.update(next, props, state);
    }
  }

  update({ xScale, format }, props, { mounted }) {
    const nodes = {};
    const ticks = xScale.ticks();

    for (let i = 0; i < ticks.length; i++) {
      const val = ticks[i];
      const key = `tick-${val}`;

      nodes[key] = {
        udid: key,
        data: val,
      };

      if (mounted[key] && !this.removed[key]) {
        nodes[key].text = mounted[key].text;
        nodes[key].type = 'UPDATING';
      } else {
        nodes[key].text = format(val);
        nodes[key].type = 'ENTERING';
      }
    }

    const keys = mounted.keys();

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (!nodes[key] && !this.removed[key]) {
        nodes[key] = {
          udid: mounted[key].udid,
          data: mounted[key].data,
          text: mounted[key].text,
          type: 'EXITING',
        };
      }
    }

    this.removed = {};

    this.setState({
      mounted: nodes,
      xScale0: props.xScale,
      xScale1: xScale,
    });
  }

  removeTick(udid) {
    this.removed[udid] = true;
  }

  render() {
    const { state: { mounted, xScale0, xScale1 }, props: { duration, yScale } } = this;

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

Axis.propTypes = {
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  format: PropTypes.func.isRequired,
  duration: PropTypes.number.isRequired,
};
