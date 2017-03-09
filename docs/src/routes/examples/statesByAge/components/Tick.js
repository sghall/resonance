// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import { format } from 'd3-format';
import transition, { stop } from 'resonance/core/transition';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { APPEAR, UPDATE, REMOVE } from 'resonance/core/types';
import { dims } from '../module';

const percentFormat = format('.1%');

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
      val: React.PropTypes.number.isRequired,
    }).isRequired,
    udid: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    prevScale: PropTypes.func.isRequired,
    currScale: PropTypes.func.isRequired,
    removeTick: PropTypes.func.isRequired,
  };

  static contextTypes = {
    theme: customPropTypes.muiRequired,
    styleManager: customPropTypes.muiRequired,
  };

  constructor(props) {
    super(props);

    (this:any).transition = transition.bind(this);
  }

  componentDidMount() {
    this.onAppear(this.props);
  }

  componentDidUpdate(prev) {
    const { props } = this;

    if (
      prev.tick !== props.tick ||
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

  tick = null; // Root node ref set in render method

  onAppear({ prevScale, currScale, tick: { val }, duration }) {
    this.transition({
      tick: {
        opacity: [1e-6, 1],
        transform: [
          `translate(${prevScale(val)},0)`,
          `translate(${currScale(val)},0)`,
        ],
      },
    }, { duration });
  }

  onUpdate({ currScale, tick: { val }, duration }) {
    this.transition({
      tick: {
        opacity: [1],
        transform: [`translate(${currScale(val)},0)`],
      },
    }, { duration });
  }

  onRemove({ currScale, udid, tick: { val }, duration, removeTick }) {
    this.transition({
      tick: {
        opacity: [1e-6],
        transform: [`translate(${currScale(val)},0)`],
      },
    }, { duration }, {
      end: () => removeTick(udid),
    });
  }

  render() {
    const { tick: { val } } = this.props;
    const classes = this.context.styleManager.render(styleSheet);

    return (
      <g ref={(d) => { this.tick = d; }}>
        <line
          x1={0} y1={0}
          x2={0} y2={dims[1]}
          className={classes.line}
        />
        <text
          x={0} y={-5}
          textAnchor="middle"
          className={classes.text}
        >{percentFormat(val)}</text>
      </g>
    );
  }
}
