// @flow weak

import React, { Component } from 'react';
import createTickGroup from 'resonance/createTickGroup';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import palette from 'docs/src/utils/palette';
import { dims } from '../module';

const numberFormat = format(',');

class Tick extends Component {
  static propTypes = {
    data: PropTypes.shape({
      val: PropTypes.number.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    prevScale: PropTypes.func.isRequired,
    currScale: PropTypes.func.isRequired,
    lazyRemove: PropTypes.func.isRequired,
  };

  state = {
    tick: {
      opacity: 1e-6,
      transform: `translate(0,${this.props.prevScale(this.props.data.val)})`,
    },
  }

  onEnter() {
    const { prevScale, currScale, data: { val }, duration } = this.props;

    return {
      tick: {
        opacity: [1e-6, 1],
        transform: [
          `translate(0,${prevScale(val)})`,
          `translate(0,${currScale(val)})`,
        ],
      },
      timing: { duration },
    };
  }

  onUpdate() {
    const { currScale, data: { val }, duration } = this.props;

    return {
      tick: {
        opacity: [1],
        transform: [`translate(0,${currScale(val)})`],
      },
      timing: { duration },
    };
  }

  onExit() {
    const { currScale, data: { val }, duration, lazyRemove } = this.props;

    return {
      tick: {
        opacity: [1e-6],
        transform: [`translate(0,${currScale(val)})`],
      },
      timing: { duration },
      events: { end: lazyRemove },
    };
  }

  render() {
    const { data: { val } } = this.props;

    return (
      <g {...this.state.tick}>
        <line
          x1={0} y1={0}
          x2={dims[0]} y2={0}
          stroke={palette.textColor}
          opacity={0.2}
        />
        <text
          fontSize={'8px'}
          textAnchor="end"
          dy=".35em"
          fill={palette.textColor}
          x={-10} y={0}
        >{numberFormat(val)}</text>
      </g>
    );
  }
}

export default createTickGroup(Tick, 'g');
