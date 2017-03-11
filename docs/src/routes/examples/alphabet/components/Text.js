// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import withTransitions from 'resonance/withTransitions';
import { easePoly } from 'd3-ease';
import { BASE_DURATION } from '../module/constants';
import { dims } from '../module';

const colors = { APPEAR: '#FF9200', UPDATE: '#A65F00', REMOVE: '#FFC373' };

class Text extends PureComponent {
  static propTypes = {
    node: PropTypes.shape({
      xValue: PropTypes.number.isRequired,
      letter: PropTypes.string.isRequired,
    }).isRequired,
    type: PropTypes.string.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  node = null; // Root node ref set in render method

  onAppear() {
    const { type, node: { xValue } } = this.props;

    return {
      node: {
        x: xValue,
        y: [0, dims[1] / 2],
        fill: ['red', colors[type]],
        opacity: [1e-6, 1],
      },
      timing: { duration: BASE_DURATION, ease: easePoly },
    };
  }

  onUpdate() {
    const { type, node: { xValue } } = this.props;

    return {
      node: {
        x: [xValue],
        y: [dims[1] / 2],
        fill: [colors[type]],
        opacity: [1],
      },
      timing: { duration: BASE_DURATION, ease: easePoly },
    };
  }

  onRemove() {
    const { type, node: { xValue }, removeNode } = this.props;

    return {
      node: {
        x: [xValue],
        y: [dims[1]],
        fill: [colors[type]],
        opacity: [1e-6],
      },
      timing: { duration: BASE_DURATION, ease: easePoly },
      events: { end: removeNode },
    };
  }

  render() {
    const { node: { letter } } = this.props;

    return (
      <text
        ref={(d) => { this.node = d; }}
        dy="-.35em"
        style={{ font: 'bold 30px monospace' }}
      >{letter}</text>
    );
  }
}

export default withTransitions(Text);

