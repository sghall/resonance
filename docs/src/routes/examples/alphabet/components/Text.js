// @flow weak

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { easePoly, easeBounce } from 'd3-ease';
import { BASE_DURATION } from '../module/constants';
import { dims } from '../module';

class Text extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      xValue: PropTypes.number.isRequired,
      letter: PropTypes.string.isRequired,
    }).isRequired,
    type: PropTypes.string.isRequired,
    lazyRemove: PropTypes.func.isRequired,
  };

  state = {
    text: {
      x: this.props.data.xValue,
      y: 0,
      fill: '#3C564B',
      opacity: 1e-6,
    },
  }

  onAppear() {
    const { data: { xValue } } = this.props;

    return {
      text: {
        x: xValue,
        y: [0, dims[1] / 2],
        fill: '#3C564B',
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
        fill: '#A5937C',
        opacity: [1],
      },
      timing: { duration: BASE_DURATION, ease: easeBounce },
    };
  }

  onRemove() {
    const { data: { xValue }, lazyRemove } = this.props;

    return {
      text: {
        x: [xValue],
        y: [dims[1]],
        fill: '#A5937C',
        opacity: [1e-6],
      },
      timing: { duration: BASE_DURATION / 2, ease: easePoly },
      events: { end: lazyRemove },
    };
  }

  render() {
    const { data: { letter } } = this.props;

    return (
      <text
        dy="-.35em"
        style={{ font: 'bold 30px monospace' }}
        {...this.state.text}
      >{letter}</text>
    );
  }
}

export default Text;

