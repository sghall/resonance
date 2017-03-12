// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import { format } from 'd3-format';
import withTransitions from 'resonance/withTransitions';
import { easeExp } from 'd3-ease';
import { dims } from '../module';

const percentFormat = format('.1%');

class Tick extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      val: React.PropTypes.number.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    prevScale: PropTypes.func.isRequired,
    currScale: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  tick = null; // Root node ref set in render method

  onAppear() {
    const { prevScale, currScale, data: { val }, duration } = this.props;

    return {
      tick: {
        opacity: [1e-6, 1],
        transform: [
          `translate(${prevScale(val)},0)`,
          `translate(${currScale(val)},0)`,
        ],
      },
      timing: { duration, ease: easeExp },
    };
  }

  onUpdate() {
    const { currScale, data: { val }, duration } = this.props;

    return {
      tick: {
        opacity: [1],
        transform: [`translate(${currScale(val)},0)`],
      },
      timing: { duration, ease: easeExp },
    };
  }

  onRemove() {
    const { currScale, data: { val }, duration, removeNode } = this.props;

    return {
      tick: {
        opacity: [1e-6],
        transform: [`translate(${currScale(val)},0)`],
      },
      timing: { duration, ease: easeExp },
      events: { end: removeNode },
    };
  }

  render() {
    const { data: { val } } = this.props;

    return (
      <g ref={(d) => { this.tick = d; }}>
        <line
          x1={0} y1={0}
          x2={0} y2={dims[1]}
          stroke="grey"
          opacity={0.2}
        />
        <text
          x={0} y={-5}
          textAnchor="middle"
          fill="grey"
          fontSize="10px"
        >{percentFormat(val)}</text>
      </g>
    );
  }
}

export default withTransitions(Tick);

