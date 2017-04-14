// @flow weak

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { arc } from 'd3-shape';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { DIMS, COLORS } from '../module/constants';

const radius = Math.min(...DIMS) / 2;

const x = scaleLinear()
  .range([0, 2 * Math.PI]);

const y = scaleSqrt()
  .range([0, radius]);

const path = arc()
  .startAngle((d) => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
  .endAngle((d) => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
  .innerRadius((d) => Math.max(0, y(d.y0)))
  .outerRadius((d) => Math.max(0, y(d.y1)));

class Arc extends Component {
  static propTypes = {
    data: PropTypes.shape({
      x0: PropTypes.number.isRequired,
      x1: PropTypes.number.isRequired,
      y0: PropTypes.number.isRequired,
      y1: PropTypes.number.isRequired,
      depth: PropTypes.number.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  state = {
    opacity: 0.7,
  }

  render() {
    const { data } = this.props;

    return (
      <path
        opacity={this.state.opacity}
        fill={COLORS[data.depth]}
        stroke="grey"
        d={path(data)}
      />
    );
  }
}

export default Arc;

