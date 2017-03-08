// @flow weak

import React, { Component, PropTypes } from 'react';
import transition, { stop } from 'resonance/core/transition';
import { APPEAR, UPDATE, REMOVE } from 'resonance/core/types';

export default class Path extends Component {
  static propTypes = {
    node: PropTypes.shape({
      udid: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      fill: PropTypes.string.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    (this:any).transition = transition.bind(this);
  }

  componentDidMount() {
    this.onAppear(this.props);
  }

  componentDidUpdate(prev) {
    const { props } = this;

    if (prev.node !== props.node) {
      switch (props.node.type) {
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
    this.transition({
      node: {
        opacity: [1e-6, 0.8],
        d: [path],
      },
    }, { duration });
  }

  onUpdate({ node: { path }, duration }) {
    this.transition({
      node: {
        opacity: [0.8],
        d: [path],
      },
    }, { duration });
  }

  onRemove({ node: { udid }, duration, removeNode }) {
    this.transition({
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
