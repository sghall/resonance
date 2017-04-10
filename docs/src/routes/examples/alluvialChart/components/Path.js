// @flow weak

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Path extends Component {
  static propTypes = {
    data: PropTypes.shape({
      path: PropTypes.string.isRequired,
      fill: PropTypes.object.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  state = {
    path: {
      opacity: 1e-6,
      d: this.props.data.path,
    },
  }

  onAppear() {
    const { data: { path }, duration } = this.props;

    return {
      path: {
        opacity: [1e-6, 0.5],
        d: [path],
      },
      timing: { duration },
    };
  }

  onUpdate() {
    const { data: { path }, duration } = this.props;

    return {
      path: {
        opacity: [0.5],
        d: [path],
      },
      timing: { duration },
    };
  }

  onRemove() {
    const { duration, removeNode } = this.props;

    return {
      path: { opacity: [1e-6] },
      timing: { duration },
      events: { end: removeNode },
    };
  }

  render() {
    const { data: { fill } } = this.props;

    return (
      <path fill={fill} {...this.state.path} />
    );
  }
}

export default Path;
