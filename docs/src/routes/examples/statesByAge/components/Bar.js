// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import { format } from 'd3-format';
import transition, { stop } from 'resonance/transition';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { APPEAR, UPDATE, REMOVE } from 'resonance/core/types';

const percentFormat = format('.2%');

const styleSheet = createStyleSheet('Bar', (theme) => {
  return {
    bar: {
      fill: theme.palette.accent[500],
      opacity: 0.8,
      '&:hover': {
        opacity: 0.5,
      },
    },
    text: {
      fontSize: 9,
      fill: theme.palette.text.secondary,
    },
  };
});

export default class Bar extends PureComponent {
  static propTypes = {
    node: PropTypes.shape({
      name: PropTypes.string.isRequired,
      xVal: PropTypes.number.isRequired,
      yVal: PropTypes.number.isRequired,
    }).isRequired,
    udid: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
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

  node = null; // Root node ref set in render method
  rect = null; // Rect node ref set in render method
  text = null; // Text node ref set in render method

  onAppear({ yScale, duration, node: { xVal, yVal } }) {
    transition.call(this, {
      node: {
        opacity: [1e-6, 1],
        transform: ['translate(0,500)', `translate(0,${yVal})`],
      },
      rect: { width: xVal, height: yScale.bandwidth() },
      text: { x: xVal - 3 },
    }, { duration });
  }

  onUpdate({ yScale, duration, node: { xVal, yVal } }) {
    transition.call(this, {
      node: {
        opacity: [1],
        transform: [`translate(0,${yVal})`],
      },
      rect: { width: [xVal], height: [yScale.bandwidth()] },
      text: { x: [xVal - 3] },
    }, { duration });
  }

  onRemove({ duration, udid, removeNode }) {
    transition.call(this, {
      node: {
        opacity: [1e-6],
        transform: ['translate(0,500)'],
      },
    }, { duration }, {
      end: () => {
        removeNode(udid);
      },
    });
  }

  render() {
    const { xScale, yScale, node: { name, xVal } } = this.props;
    const classes = this.context.styleManager.render(styleSheet);

    return (
      <g ref={(d) => { this.node = d; }}>
        <rect
          ref={(d) => { this.rect = d; }}
          className={classes.bar}
        />
        <text
          dy="0.35em"
          x={-15}
          textAnchor="middle"
          className={classes.text}
          y={yScale.bandwidth() / 2}
        >{name}</text>
        <text
          ref={(d) => { this.text = d; }}
          textAnchor="end"
          dy="0.35em"
          className={classes.text}
          y={yScale.bandwidth() / 2}
        >{percentFormat(xScale.invert(xVal))}</text>
      </g>
    );
  }
}
