// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import { format } from 'd3-format';
import withTransitions from 'resonance/withTransitions';
import { dims } from '../module';

const numberFormat = format(',');
const percentFormat = format('.1p');

class Tick extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      val: React.PropTypes.number.isRequired,
    }).isRequired,
    offset: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    prevScale: PropTypes.func.isRequired,
    currScale: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  tick = null; // Root node ref set in render method

  onAppear(prev) {
    const { prevScale, currScale, data: { val }, offset, duration } = this.props;
    const timing = { duration };

    if (prev.offset !== offset) {
      return {
        tick: {
          opacity: [1e-6, 1],
          transform: `translate(0,${currScale(val)})`,
        },
        timing,
      };
    }

    return {
      tick: {
        opacity: [1e-6, 1],
        transform: [
          `translate(0,${prevScale(val)})`,
          `translate(0,${currScale(val)})`,
        ],
      },
      timing,
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

  onRemove(prev) {
    const { currScale, data: { val }, offset, duration, removeNode } = this.props;
    const timing = { duration };
    const events = { end: removeNode };

    if (prev.offset !== offset) {
      return {
        tick: {
          opacity: 1e-6,
          transform: [`translate(0,${currScale(val)})`],
        },
        timing,
        events,
      };
    }

    return {
      tick: {
        opacity: [1e-6],
        transform: [`translate(0,${currScale(val)})`],
      },
      timing,
      events,
    };
  }

  render() {
    const { offset, data: { val } } = this.props;

    return (
      <g ref={(d) => { this.tick = d; }}>
        <line
          x1={0} y1={0}
          x2={dims[0]} y2={0}
          stroke="white"
          opacity={0.2}
        />
        <text
          fontSize={'9px'}
          textAnchor="end"
          dy=".35em"
          fill="white"
          x={-5} y={0}
        >{offset === 'expand' ? percentFormat(val) : numberFormat(val)}</text>
      </g>
    );
  }
}

export default withTransitions(Tick);
