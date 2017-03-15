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

  node = null; // Root node ref set in render method

  onAppear() {
    const { data: { path }, duration } = this.props;

    return {
      node: {
        opacity: [1e-6, 0.8],
        d: [path],
      },
      timing: { duration },
    };
  }

  onUpdate() {
    const { data: { path }, duration } = this.props;

    return {
      node: {
        opacity: [0.8],
        d: [path],
      },
      timing: { duration },
    };
  }

  onRemove() {
    const { duration, removeNode } = this.props;

    return {
      node: { opacity: [1e-6] },
      timing: { duration },
      events: { end: removeNode },
    };
  }

  render() {
    const { activeSeries, data: { fill, name } } = this.props;

    return (
      <path
        ref={(d) => { this.node = d; }}
        fill={activeSeries === name ? 'url(#hatch)' : fill}
      />
    );
  }
}

export default Path;
