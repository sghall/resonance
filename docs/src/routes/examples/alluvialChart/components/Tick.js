// @flow weak

import React, { Component, PropTypes } from 'react';
import { format } from 'd3-format';
import palette from 'docs/src/utils/palette';
import { dims } from '../module';

const numberFormat = format(',');

class Tick extends Component {
  static propTypes = {
    data: PropTypes.shape({
      val: React.PropTypes.number.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    prevScale: PropTypes.func.isRequired,
    currScale: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  state = {
    tick: {
      opacity: 1e-6,
      transform: `translate(0,${this.props.prevScale(this.props.data.val)})`,
    },
  }

  onAppear() {
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

  onRemove() {
    const { currScale, data: { val }, duration, removeNode } = this.props;

    return {
      tick: {
        opacity: [1e-6],
        transform: [`translate(0,${currScale(val)})`],
      },
      timing: { duration },
      events: { end: removeNode },
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

export default Tick;
