// @flow weak

import React, { Component, PropTypes } from 'react';

const noop = () => {};

export default class Axis extends Component {

  constructor(props) {
    super(props);

    this.state = {
      yTicks: [],
      prevYScale: noop,
      currYScale: noop,
      xTicks: [],
      prevXScale: noop,
      currXScale: noop,
    };
  }

  componentDidMount() {
    const { props } = this;
    this.update(props, props);
  }

  componentWillReceiveProps(next) {
    const { props } = this;

    if (
      props.xScale !== next.xScale ||
      props.yScale !== next.yScale
    ) {
      this.update(props, next);
    }
  }

  update(prev, next) {
    const xTicks = next.xScale.ticks ? next.xScale.ticks() : [];
    const yTicks = next.yScale.ticks ? next.yScale.ticks() : [];

    this.setState({
      yTicks,
      prevYScale: prev.yScale,
      currYScale: next.yScale,
      xTicks,
      prevXScale: prev.xScale,
      currXScale: next.xScale,
    });
  }

  render() {
    const { state, props } = this;

    return (
      <g>
        {React.cloneElement(props.children, { ...props, ...state })}
      </g>
    );
  }
}

Axis.propTypes = {
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

