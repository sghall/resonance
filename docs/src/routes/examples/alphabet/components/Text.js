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
    // removeNode: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      text: {
        x: props.data.xValue,
        y: 0,
        fill: colors[props.type],
        opacity: 1e-6,
      },
    };
  }

  text = null; // Root text ref set in render method

  onAppear() {
    const { type, data: { xValue } } = this.props;

    return {
      text: {
        x: xValue,
        y: [0, dims[1] / 2],
        fill: colors[type],
        opacity: [1],
      },
      timing: { duration: BASE_DURATION, ease: easePoly },
    };
  }

  // onUpdate() {
  //   const { type, data: { xValue } } = this.props;

  //   return {
  //     text: {
  //       x: [xValue],
  //       y: [dims[1] / 2],
  //       fill: colors[type],
  //       opacity: [1],
  //     },
  //     timing: { duration: BASE_DURATION, ease: easePoly },
  //   };
  // }

  // onRemove() {
  //   const { type, data: { xValue }, removeNode } = this.props;

  //   return {
  //     text: {
  //       x: [xValue],
  //       y: [dims[1]],
  //       fill: colors[type],
  //       opacity: [1e-6],
  //     },
  //     timing: { duration: BASE_DURATION, ease: easePoly },
  //     events: { end: removeNode },
  //   };
  // }

  render() {
    const { data: { letter } } = this.props;

    return (
      <text
        ref={(d) => { this.text = d; }}
        dy="-.35em"
        style={{ font: 'bold 30px monospace' }}
        {...this.state.text}
      >{letter}</text>
    );
  }
}

export default Text;

