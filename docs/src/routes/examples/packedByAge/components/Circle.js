// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import { scaleOrdinal } from 'd3-scale';
import { COLORS, AGES } from '../module/constants';

const colors = scaleOrdinal()
  .range(COLORS).domain(AGES);

const getFill = ({ data: { name, depth }, sortKey }) => {
  const age = name.slice(5);

  if (age === sortKey) {
    return 'black';
  }

  return depth === 2 ? colors(age) : 'rgba(127,127,127,0.5)';
};

class Circle extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
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

  state = {
    node: {
      opacity: 1e-6,
      transform: `translate(${this.props.data.x},${this.props.data.y})`,
    },
    circle: {
      r: 1e-6,
      fill: getFill(this.props),
    },
  }

  node = null;   // Root node ref set in render method
  circle = null; // Circle node ref set in render method

  onAppear() {
    const { duration, data: { x, y, r, depth } } = this.props;
    const d0 = depth === 0 ? 0 : duration;
    const d1 = depth === 0 ? 0 : duration * 2;

    return {
      node: {
        opacity: [1e-6, 0.8],
        transform: `translate(${x},${y})`,
      },
      circle: { fill: getFill(this.props), r: [1e-6, r] },
      timing: { duration: d0, delay: d1 },
    };
  }

  onUpdate() {
    const { duration, data: { x, y, r } } = this.props;

    return {
      node: {
        opacity: [0.8],
        transform: [`translate(${x},${y})`],
      },
      circle: { fill: getFill(this.props), r: [r] },
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
    const { type, data: { name, depth, r } } = this.props;

    return (
      <g
        {...this.state.node}
        style={{ pointerEvents: type === 'REMOVE' ? 'none' : 'all' }}
      >
        <title>{name}</title>
        <circle
          stroke="rgba(0,0,0,0.2)"
          {...this.state.circle}
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

export default Circle;

