// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import withTransitions from 'resonance/withTransitions';
import { easePoly } from 'd3-ease';
import { format } from 'd3-format';
import palette from 'docs/src/utils/palette';

const percentFormat = format('.2%');

class Bar extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      xVal: PropTypes.number.isRequired,
      yVal: PropTypes.number.isRequired,
    }).isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  node = null; // Root node ref set in render method
  rect = null; // Rect node ref set in render method
  text = null; // Text node ref set in render method

  onAppear() {
    const { yScale, duration, data: { xVal, yVal } } = this.props;

    return {
      node: {
        opacity: [1e-6, 1],
        transform: ['translate(0,500)', `translate(0,${yVal})`],
      },
      rect: { width: xVal, height: yScale.bandwidth() },
      text: { x: xVal - 3 },
      timing: { duration, ease: easePoly },
    };
  }

  onUpdate() {
    const { yScale, duration, data: { xVal, yVal } } = this.props;

    return {
      node: {
        opacity: [1],
        transform: [`translate(0,${yVal})`],
      },
      rect: { width: [xVal], height: [yScale.bandwidth()] },
      text: { x: [xVal - 3] },
      timing: { duration, ease: easePoly },
    };
  }

  onRemove() {
    const { duration, removeNode } = this.props;

    return {
      node: {
        opacity: [1e-6],
        transform: ['translate(0,500)'],
      },
      timing: { duration, ease: easePoly },
      events: { end: removeNode },
    };
  }

  render() {
    const { xScale, yScale, data: { name, xVal } } = this.props;

    return (
      <g ref={(d) => { this.node = d; }}>
        <rect
          ref={(d) => { this.rect = d; }}
          fill={palette.primary1Color}
          opacity={0.4}
        />
        <text
          dy="0.35em"
          x={-15}
          textAnchor="middle"
          fill={palette.textColor}
          fontSize={10}
          y={yScale.bandwidth() / 2}
        >{name}</text>
        <text
          ref={(d) => { this.text = d; }}
          textAnchor="end"
          dy="0.35em"
          fill="white"
          fontSize={10}
          y={yScale.bandwidth() / 2}
        >{percentFormat(xScale.invert(xVal))}</text>
      </g>
    );
  }
}

export default withTransitions(Bar);

