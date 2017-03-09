// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import transition, { stop } from 'resonance/transition';
import { scaleOrdinal } from 'd3-scale';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { APPEAR, UPDATE, REMOVE } from 'resonance/core/types';
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

const styleSheet = createStyleSheet('Circle', (theme) => ({
  [REMOVE]: {
    pointerEvents: 'none',
  },
  circle: {
    '&:hover': {
      opacity: 0.7,
    },
  },
  text: {
    fontSize: 12,
    textAnchor: 'middle',
    pointerEvents: 'none',
    opacity: 1,
    fill: theme.palette.text.secondary,
  },
}));

export default class Circle extends PureComponent {
  static propTypes = {
    node: PropTypes.shape({
      name: PropTypes.string.isRequired,
      r: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      depth: PropTypes.number.isRequired,
    }).isRequired,
    udid: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sortKey: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  static contextTypes = {
    theme: customPropTypes.muiRequired,
    styleManager: customPropTypes.muiRequired,
  };

  componentDidMount() {
    this.onAppear(this.props);
  }

  componentDidUpdate(prev) {
    const { props } = this;

    if (
      prev.node !== props.node ||
      prev.type !== props.type
    ) {
      switch (props.type) {
        case APPEAR:
          this.onAppear(props);
          break;
        case UPDATE:
          this.onUpdate(props);
          break;
        case REMOVE:
          this.onRemove(props);
          break;
        default:
          break;
      }
    }
  }

  componentWillUnmount() {
    stop.call(this);
  }

  node = null;   // Root node ref set in render method
  circle = null; // Circle node ref set in render method

  onAppear({ duration, node: { name, x, y, r, depth }, sortKey }) {
    const d0 = depth === 0 ? 0 : duration;
    const d1 = depth === 0 ? 0 : duration * 2;

    transition.call(this, {
      node: {
        opacity: [1e-6, 0.8],
        transform: ['translate(0,0)', `translate(${x},${y})`],
      },
      circle: { fill: getFill(depth, name, sortKey), r },
    }, { duration: d0, delay: d1 });
  }

  onUpdate({ duration, node: { name, x, y, r, depth }, sortKey }) {
    transition.call(this, {
      node: {
        opacity: [0.8],
        transform: [`translate(${x},${y})`],
      },
      circle: { fill: getFill(depth, name, sortKey), r: [r] },
    }, { duration, delay: duration });
  }

  onRemove({ duration, udid, removeNode }) {
    transition.call(this, {
      node: {
        opacity: [1e-6],
      },
      circle: { fill: 'rgba(0,0,0,0.3)' },
    }, { duration }, {
      end: () => {
        removeNode(udid);
      },
    });
  }

  render() {
    const { type, node: { name, depth, r } } = this.props;
    const classes = this.context.styleManager.render(styleSheet);

    return (
      <g
        ref={(d) => { this.node = d; }}
        className={classes[type]}
      >
        <title>{name}</title>
        <circle
          ref={(d) => { this.circle = d; }}
          stroke="rgba(0,0,0,0.2)"
          className={depth === 2 ? classes.circle : ''}
        />
        <text className={classes.text} dy="0.3em">
          {(depth === 2 && r > 10) ? name.slice(0, 2) : ''}
        </text>
      </g>
    );
  }
}
