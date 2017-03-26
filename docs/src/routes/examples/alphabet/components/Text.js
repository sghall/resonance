// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import { easePoly } from 'd3-ease';
import { BASE_DURATION } from '../module/constants';
import { dims } from '../module';

const colors = { APPEAR: '#3C564B', UPDATE: '#A5937C', REMOVE: '#4D2B1D' };

class Text extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      xValue: PropTypes.number.isRequired,
      letter: PropTypes.string.isRequired,
    }).isRequired,
    type: PropTypes.string.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      text: {
        x: props.data.xValue,
        y: 0,
        opacity: 1e-6,
      },
    };
  }

  onAppear() {
    const { data: { xValue } } = this.props;

    return {
      text: {
        x: xValue,
        y: [0, dims[1] / 2],
        opacity: [1e-6, 1],
      },
      timing: { duration: BASE_DURATION, ease: easePoly },
    };
  }

  onUpdate() {
    const { data: { xValue } } = this.props;

    return {
      text: {
        x: [xValue],
        y: [dims[1] / 2],
        opacity: [1],
      },
      timing: { duration: BASE_DURATION, ease: easePoly },
    };
  }

  onRemove() {
    const { data: { xValue }, removeNode } = this.props;

    return {
      text: {
        x: [xValue],
        y: [dims[1]],
        opacity: [1e-6],
      },
      timing: { duration: BASE_DURATION, ease: easePoly },
      events: { end: removeNode },
    };
  }

  render() {
    const { type, data: { letter } } = this.props;

    return (
      <text
        dy="-.35em"
        fill={colors[type]}
        style={{ font: 'bold 30px monospace' }}
        {...this.state.text}
      >{letter}</text>
    );
  }
}

export default Text;

