// @flow weak

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { arcTween } from './utils';
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
    path: PropTypes.func.isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
    clickHandler: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    (this:any).clickHandler = this.clickHandler.bind(this);
  }

  state = {
    opacity: 0.4,
    path: {
      d: this.props.path(this.props.data),
    },
  }

  onUpdate() {
    const { data, path, duration } = this.props;

    if (data.noTransition) {
      return this.setState({
        path: { d: path(data) },
      });
    }

    return {
      path: {
        d: arcTween(data),
      },
      timing: { duration },
    };
  }

  clickHandler() {
    this.props.clickHandler(this.props.data);
  }

  render() {
    const { data } = this.props;

    return (
      <path
        onClick={this.clickHandler}
        opacity={this.state.opacity}
        fill={COLORS[data.depth]}
        stroke={data.noTransition ? 'none' : 'white'}
        strokeWidth={0.5}
        d={this.state.path.d}
      />
    );
  }
}

export default Arc;

