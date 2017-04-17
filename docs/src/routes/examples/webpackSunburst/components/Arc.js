// @flow weak

import React, { Component } from 'react';
// import { transition } from 'resonance';
import PropTypes from 'prop-types';
import { path } from './utils';
import { COLORS } from '../module/constants';

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
    clickHandler: PropTypes.func.isRequired,
  };

  state = {
    opacity: 0.7,
    path: {
      d: path(this.props.data),
    },
  }

  componentWillReceiveProps() {
    this.setState({
      path: {
        d: path(this.props.data),
      },
    });
  }

  render() {
    const { data, clickHandler } = this.props;

    return (
      <path
        onClick={() => clickHandler(data)}
        opacity={this.state.opacity}
        fill={COLORS[data.depth]}
        stroke="white"
        strokeWidth={0.5}
        d={this.state.path.d}
      />
    );
  }
}

export default Arc;

