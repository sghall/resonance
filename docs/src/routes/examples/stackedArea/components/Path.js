// @flow weak

import React, { Component, PropTypes } from 'react';
import { timer } from 'd3-timer';
import { interpolateNumber, interpolateString } from 'd3-interpolate';
import { APPEAR, UPDATE, REMOVE, REVIVE } from 'resonance';

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

  componentDidMount() {
    this.onAppear(this.props);
  }

  componentWillReceiveProps(next) {
    const { props } = this;

    if (props.node !== next.node) {
      this.transition.stop();

      switch (next.node.type) {
        case APPEAR:
          this.onAppear(next);
          break;
        case UPDATE:
          this.onUpdate(next);
          break;
        case REMOVE:
          this.onRemove(props);
          break;
        case REVIVE:
          this.onAppear(next);
          break;
        default:
          break;
      }
    }
  }

  shouldComponentUpdate(next) {
    return this.props.node !== next.node;
  }

  componentWillUnmount() {
    this.transition.stop();
  }

  onAppear({ node: { path }, duration }) {
    this.node.setAttribute('opacity', 1e-6);
    this.node.setAttribute('d', path);

    const interp = interpolateNumber(1e-6, 0.8);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;
      this.node.setAttribute('opacity', interp(t));
      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  onUpdate({ node: { path }, duration }) {
    this.node.setAttribute('opacity', 0.8);

    const interp = interpolateString(this.node.getAttribute('d'), path);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;
      this.node.setAttribute('d', interp(t));
      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  onRemove({ node: { udid }, removeNode }) {
    this.node.setAttribute('opacity', 1e-6);
    this.transition.stop();
    removeNode(udid);
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
