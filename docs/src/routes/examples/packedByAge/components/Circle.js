// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import withTransitions from 'resonance/withTransitions';
import { scaleOrdinal } from 'd3-scale';
import { COLORS, AGES } from '../module/constants';

const colors = scaleOrdinal()
  .range(COLORS).domain(AGES);

const getFill = (depth, name, sortKey) => {
  const age = name.slice(5);

  if (age === sortKey) {
    return 'black';
  }

  return depth === 2 ? colors(age) : 'rgba(255,255,255,0.7)';
};

class Circle extends PureComponent {
  static propTypes = {
    node: PropTypes.shape({
      name: PropTypes.string.isRequired,
      r: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      depth: PropTypes.number.isRequired,
    }).isRequired,
    type: PropTypes.string.isRequired,
    sortKey: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  node = null;   // Root node ref set in render method
  circle = null; // Circle node ref set in render method

  onAppear() {
    const { duration, node: { name, x, y, r, depth }, sortKey } = this.props;
    const d0 = depth === 0 ? 0 : duration;
    const d1 = depth === 0 ? 0 : duration * 2;

    return {
      node: {
        opacity: [1e-6, 0.8],
        transform: ['translate(0,0)', `translate(${x},${y})`],
      },
      circle: { fill: getFill(depth, name, sortKey), r },
      timing: { duration: d0, delay: d1 },
    };
  }

  onUpdate() {
    const { duration, node: { name, x, y, r, depth }, sortKey } = this.props;

    return {
      node: {
        opacity: [0.8],
        transform: [`translate(${x},${y})`],
      },
      circle: { fill: getFill(depth, name, sortKey), r: [r] },
      timing: { duration, delay: duration },
    };
  }

  onRemove() {
    const { duration, removeNode } = this.props;

    return {
      node: {
        opacity: [1e-6],
      },
      circle: { fill: 'rgba(0,0,0,0.3)' },
      timing: { duration },
      events: { end: removeNode },
    };
  }

  render() {
    const { type, node: { name, depth, r } } = this.props;

    return (
      <g
        ref={(d) => { this.node = d; }}
        style={{ pointerEvents: type === 'REMOVE' ? 'none' : 'all' }}
      >
        <title>{name}</title>
        <circle
          ref={(d) => { this.circle = d; }}
          stroke="rgba(0,0,0,0.2)"
        />
        <text
          fill="white"
          dy="0.3em"
          fontSize="10px"
          textAnchor="middle"
        >
          {(depth === 2 && r > 10) ? name.slice(0, 2) : ''}
        </text>
      </g>
    );
  }
}

export default withTransitions(Circle);

