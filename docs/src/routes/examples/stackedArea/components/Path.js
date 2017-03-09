// @flow weak

import React, { Component, PropTypes } from 'react';
import transition, { stop } from 'resonance/core/transition';
import { APPEAR, UPDATE, REMOVE } from 'resonance/core/types';

export default class Path extends Component {
  static propTypes = {
    node: PropTypes.shape({
      path: PropTypes.string.isRequired,
      fill: PropTypes.string.isRequired,
    }).isRequired,
    udid: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.onAppear(this.props);
  }

  componentDidUpdate(prev) {
    const { props } = this;

    if (
      prev.node !== props.node ||
      prev.type !== props.type
    ) {
      switch (props.type) {
        case APPEAR:
          this.onAppear(props);
          break;
        case UPDATE:
          this.onUpdate(props);
          break;
        case REMOVE:
          this.onRemove(props);
          break;
        default:
          break;
      }
    }
  }

  componentWillUnmount() {
    stop.call(this);
  }

  transition = null; // Last transition run (or running)
  node = null;       // Root node ref set in render method

  onAppear({ node: { path }, duration }) {
    transition.call(this, {
      node: {
        opacity: [1e-6, 0.8],
        d: [path],
      },
    }, { duration });
  }

  onUpdate({ node: { path }, duration }) {
    transition.call(this, {
      node: {
        opacity: [0.8],
        d: [path],
      },
    }, { duration });
  }

  onRemove({ udid, duration, removeNode }) {
    transition.call(this, {
      node: {
        opacity: [1e-6],
      },
    }, { duration: duration / 3 }, {
      end: () => removeNode(udid),
    });
  }

  render() {
    const { node: { fill } } = this.props;

    return (
      <path
        ref={(d) => { this.node = d; }}
        fill={fill}
      />
    );
  }
}
