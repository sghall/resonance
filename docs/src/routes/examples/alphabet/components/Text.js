// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import transition, { stop } from 'resonance/core/transition';
import { APPEAR, UPDATE, REMOVE } from 'resonance/core/types';
import { BASE_DURATION } from '../module/constants';
import { dims } from '../module';

const colors = { APPEAR: '#FF9200', UPDATE: '#A65F00', REMOVE: '#FFC373' };

export default class Text extends PureComponent {
  static propTypes = {
    node: PropTypes.shape({
      xValue: PropTypes.number.isRequired,
      letter: PropTypes.string.isRequired,
    }).isRequired,
    udid: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
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

  node = null; // Root node ref set in render method

  onAppear({ node: { xValue } }) {
    transition.call(this, {
      node: {
        x: xValue,
        y: [0, dims[1] / 2],
        opacity: [1e-6, 1],
      },
    }, { duration: BASE_DURATION });
  }

  onUpdate({ node: { xValue } }) {
    transition.call(this, {
      node: {
        x: [xValue],
        y: [dims[1] / 2],
        opacity: [1],
      },
    }, { duration: BASE_DURATION });
  }

  onRemove({ udid, node: { xValue }, removeNode }) {
    transition.call(this, {
      node: {
        x: [xValue],
        y: [dims[1]],
        opacity: [1e-6],
      },
    }, { duration: BASE_DURATION }, {
      end: () => removeNode(udid),
    });
  }

  render() {
    const { props: { type, node: { letter } } } = this;

    return (
      <text
        ref={(d) => { this.node = d; }}
        dy="-.35em"
        style={{ font: 'bold 30px monospace' }}
        fill={colors[type]}
      >{letter}</text>
    );
  }
}
