// @flow weak

import React, { Component, PropTypes } from 'react';
import withTransitions from 'resonance/withTransitions';

class Path extends Component {
  static propTypes = {
    data: PropTypes.shape({
      path: PropTypes.string.isRequired,
      fill: PropTypes.object.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
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
    const { data: { fill } } = this.props;

    return (
      <path
        ref={(d) => { this.node = d; }}
        fill={fill}
      />
    );
  }
}

export default withTransitions(Path);
