// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import * as d3 from 'd3';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { APPEAR, UPDATE, REMOVE, REVIVE } from 'resonance/core/types';

const percentFormat = d3.format('.2%');

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
      udid: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      xVal: PropTypes.number.isRequired,
      yVal: PropTypes.number.isRequired,
    }).isRequired,
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

    if (prev.node !== props.node) {
      switch (props.node.type) {
        case APPEAR:
          this.onAppear(props);
          break;
        case UPDATE:
          this.onUpdate(props);
          break;
        case REMOVE:
          this.onRemove(props);
          break;
        case REVIVE:
          this.onUpdate(props);
          break;
        default:
          break;
      }
    }
  }

  node = null; // Root node ref set in render method
  rect = null; // Rect node ref set in render method
  text = null; // Text node ref set in render method

  onAppear({ yScale, duration, node: { xVal, yVal } }) {
    this.rect.setAttribute('width', xVal);
    this.rect.setAttribute('height', yScale.bandwidth());
    this.text.setAttribute('x', xVal - 3);
    this.node.setAttribute('opacity', 1e-6);
    this.node.setAttribute('transform', 'translate(0,500)');

    d3.select(this.node)
      .transition().duration(duration)
      .attr('opacity', 1)
      .attr('transform', `translate(0,${yVal})`);
  }

  onUpdate({ yScale, duration, node: { xVal, yVal } }) {
    d3.select(this.rect)
      .transition().duration(duration)
      .attr('width', xVal)
      .attr('height', yScale.bandwidth());

    d3.select(this.text)
      .transition().duration(duration)
      .attr('x', xVal - 3);

    d3.select(this.node)
      .transition().duration(duration)
      .attr('opacity', 1)
      .attr('transform', `translate(0,${yVal})`);
  }

  onRemove({ duration, node: { udid }, removeNode }) {
    d3.select(this.node)
      .transition().duration(duration)
      .attr('opacity', 1e-6)
      .attr('transform', 'translate(0,500)')
      .on('end', () => {
        removeNode(udid);
      });
  }

  render() {
    const { xScale, yScale, node: { udid, xVal } } = this.props;
    const classes = this.context.styleManager.render(styleSheet);

    return (
      <g ref={(d) => { this.node = d; }}>
        <rect
          ref={(d) => { this.rect = d; }}
          className={classes.bar}
        />
        <text
          dy="0.35em"
          x={-20}
          className={classes.text}
          y={yScale.bandwidth() / 2}
        >{udid.slice(4)}</text>
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
