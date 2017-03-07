// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import { format } from 'd3-format';
import transition from 'resonance/core/transition';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { APPEAR, UPDATE, REMOVE, REVIVE } from 'resonance/core/types';
import { dims } from '../module';

const numberFormat = format(',');
const percentFormat = format('.1p');

export const styleSheet = createStyleSheet('Tick', (theme) => {
  return {
    line: {
      strokeWidth: 1,
      pointerEvents: 'none',
      opacity: 0.2,
      stroke: theme.palette.text.primary,
    },
    text: {
      fontSize: 9,
      fill: theme.palette.text.secondary,
    },
  };
});

export default class Tick extends PureComponent {
  static propTypes = {
    tick: PropTypes.shape({
      udid: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      data: React.PropTypes.number.isRequired,
    }).isRequired,
    offset: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    prevScale: PropTypes.func.isRequired,
    currScale: PropTypes.func.isRequired,
    removeTick: PropTypes.func.isRequired,
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

  componentWillUnmount() {
    this.transition.stop();
  }

  transition = null; // Last transition run (or running)
  tick = null;       // Root node ref set in render method


  onAppear({ prevScale, currScale, tick: { data }, duration }) {
    transition.call(this, {
      tick: {
        opacity: [1e-6, 1],
        transform: [
          `translate(0,${prevScale(data)})`,
          `translate(0,${currScale(data)})`,
        ],
      },
    }, { duration });
  }

  onUpdate({ currScale, tick: { data }, duration }) {
    transition.call(this, {
      tick: {
        opacity: [1],
        transform: [`translate(0,${currScale(data)})`],
      },
    }, { duration });
  }

  onRemove({ currScale, tick: { udid, data }, removeTick, duration }) {
    transition.call(this, {
      tick: {
        opacity: [1e-6],
        transform: [`translate(0,${currScale(data)})`],
      },
    }, { duration }, {
      end: () => removeTick(udid),
    });
  }

  render() {
    const { offset, tick: { data } } = this.props;
    const classes = this.context.styleManager.render(styleSheet);

    return (
      <g ref={(d) => { this.tick = d; }}>
        <line
          x1={0} y1={0}
          x2={dims[0]} y2={0}
          className={classes.line}
        />
        <text
          fontSize={'9px'}
          textAnchor="end"
          dy=".35em"
          x={-5} y={0}
          className={classes.text}
        >{offset === 'expand' ? percentFormat(data) : numberFormat(data)}</text>
      </g>
    );
  }
}
