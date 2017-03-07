// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import transition from 'resonance/core/transition';
import { APPEAR, UPDATE, REMOVE, REVIVE } from 'resonance/core/types';
import { BASE_DURATION } from '../module/constants';
import { dims } from '../module';

const colors = { APPEAR: '#FF9200', UPDATE: '#A65F00', REMOVE: '#FFC373', REVIVE: '#66A3D2' };

export default class Text extends PureComponent {
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

  componentDidUpdate(prev) {
    const { props } = this;

    const c = Math.random();

    if (c > 0.80) {
      this.duration = BASE_DURATION;
    } else {
      this.duration = BASE_DURATION * 0.55;
    }

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
        case REVIVE:
          this.onUpdate(props);
          break;
        default:
          break;
      }
    }
  }

  duration = BASE_DURATION;
  node = null;       // Root node ref set in render method

  onAppear({ node: { xVal } }) {
    transition.call(this, {
      node: {
        x: xVal,
        y: [0, dims[1] / 2],
        opacity: [1e-6, 1],
      },
    }, { duration: this.duration });
  }

  onUpdate({ node: { xVal } }) {
    transition.call(this, {
      node: {
        x: [xVal],
        y: [dims[1] / 2],
        opacity: [1],
      },
    }, { duration: this.duration });
  }

  onRemove({ node: { udid, xVal }, removeNode }) {
    transition.call(this, {
      node: {
        x: [xVal],
        y: [dims[1]],
        opacity: [1e-6],
      },
    }, { duration: this.duration }, {
      end: () => removeNode(udid),
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
