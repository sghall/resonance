// @flow weak

import React, { PureComponent, PropTypes } from 'react';

class Path extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      path: PropTypes.string.isRequired,
      fill: PropTypes.object.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
    activeSeries: PropTypes.string.isRequired,
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
        opacity: [1e-6, 0.8],
        d: [path],
      },
      timing: { duration },
    };
  }

  onUpdate() {
    const { data: { path }, duration } = this.props;

    return {
      path: {
        opacity: [0.8],
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
    const { activeSeries, data: { fill, name } } = this.props;

    return (
      <path
        {...this.state.path}
        fill={activeSeries === name ? 'url(#hatch)' : fill}
      />
    );
  }
}

export default Path;
