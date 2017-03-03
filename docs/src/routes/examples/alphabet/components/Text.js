// @flow weak

import React, { Component, PropTypes } from 'react';
import { timer } from 'd3-timer';
import { interpolateObject, interpolateNumber } from 'd3-interpolate';
import { APPEAR, UPDATE, REMOVE, REVIVE } from 'resonance';
import { dims } from '../module';

const colors = { APPEAR: '#CDDC39', UPDATE: '#FAFAFA', REMOVE: '#F44336', REVIVE: 'blue' };
const baseDuration = 500;

let duration = baseDuration;

export default class Text extends Component {
  static propTypes = {
    node: PropTypes.shape({
      udid: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      xVal: PropTypes.number.isRequired,
    }).isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.onAppear(this.props);
  }

  componentWillReceiveProps(next) {
    const { props } = this;

    const c = Math.random();

    if (c > 0.75) {
      duration = baseDuration * 1.50;
    } else {
      duration = baseDuration * 0.75;
    }

    if (props.node !== next.node) {
      this.transition.stop();

      switch (next.node.type) {
        case APPEAR:
          this.onAppear(next);
          break;
        case UPDATE:
          this.onUpdate(props, next);
          break;
        case REMOVE:
          this.onRemove(next);
          break;
        case REVIVE:
          this.onUpdate(props, next);
          break;
        default:
          break;
      }
    }
  }

  componentWillUnmount() {
    this.transition.stop();
  }

  onAppear({ node: { xVal } }) {
    this.node.setAttribute('x', xVal);
    const beg = { opacity: 1e-6, y: 0 };
    const end = { opacity: 1, y: dims[1] / 2 };
    const interp = interpolateObject(beg, end);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;
      const { opacity, y } = interp(t);

      this.node.setAttribute('y', y);
      // this.node.setAttribute('opacity', opacity);

      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  onUpdate({ node: { xVal, udid }, removeNode }, next) {
    const x1 = this.node.getAttribute('x');
    const y1 = this.node.getAttribute('y');
    const o1 = this.node.getAttribute('opacity');

    const beg = { opacity: o1, x: x1, y: y1 };
    const end = { opacity: 1, x: next.node.xVal, y: dims[1] / 2 };
    const interp = interpolateObject(beg, end);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;

      const { x, y, opacity } = interp(t);
      this.node.setAttribute('x', x);
      this.node.setAttribute('y', y);
      // this.node.setAttribute('opacity', opacity);

      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  onRemove({ node: { udid, xVal }, removeNode }) {
    const x1 = this.node.getAttribute('x');
    const y1 = this.node.getAttribute('y');
    const o1 = this.node.getAttribute('opacity');

    const beg = { opacity: o1, y: y1, x: x1 };
    const end = { opacity: 1, y: dims[1], x: xVal };
    const interp = interpolateObject(beg, end);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;
      const { x, y, opacity } = interp(t);

      this.node.setAttribute('x', x);
      this.node.setAttribute('y', y);
      // this.node.setAttribute('opacity', opacity);

      if (t === 1) {
        this.transition.stop();
        removeNode(udid);
      }
    });
  }

  render() {
    const { props: { node: { udid, type } } } = this;

    return (
      <text
        ref={(d) => { this.node = d; }}
        dy="-.35em"
        style={{ font: 'bold 30px monospace' }}
        fill={colors[type]}
      >{udid}</text>
    );
  }
}
