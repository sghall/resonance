// @flow weak

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Path extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      path: PropTypes.string.isRequired,
      fill: PropTypes.object.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    lazyRemove: PropTypes.func.isRequired,
    activeSeries: PropTypes.string.isRequired,
  };

  state = {
    path: {
      opacity: 1e-6,
      d: this.props.data.path,
    },
  }

  onEnter() {
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

  onExit() {
    const { duration, lazyRemove } = this.props;

    return {
      path: { opacity: [1e-6] },
      timing: { duration },
      events: { end: lazyRemove },
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
