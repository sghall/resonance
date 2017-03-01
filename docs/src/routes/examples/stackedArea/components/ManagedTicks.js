// @flow weak

import React, { Component, PropTypes } from 'react';
import { timer } from 'd3-timer';
import { format } from 'd3-format';
import { interpolateNumber, interpolateTransformSvg } from 'd3-interpolate';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import withManagedData, {
  APPEAR,
  UPDATE,
  REMOVE,
  REVIVE,
} from 'resonance/withManagedData';

const numberFormat = format(',');
// const percentFormat = format('.1p');

export const styleSheet = createStyleSheet('Y-Tick', (theme) => {
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

class Tick extends Component {
  static propTypes = {
    node: PropTypes.shape({
      udid: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      data: React.PropTypes.number.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    prevYScale: PropTypes.func.isRequired,
    currYScale: PropTypes.func.isRequired,
    currXScale: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
  };

  static contextTypes = {
    theme: customPropTypes.muiRequired,
    styleManager: customPropTypes.muiRequired,
  };

  componentDidMount() {
    this.onAppear(this.props);
  }

  componentWillReceiveProps(next) {
    const { props } = this;

    if (props.node !== next.node) {
      this.transition.stop();

      switch (next.node.type) {
        case APPEAR:
          this.onAppear(next);
          break;
        case UPDATE:
          this.onUpdate(next);
          break;
        case REMOVE:
          this.onRemove(next);
          break;
        case REVIVE:
          this.onUpdate(next);
          break;
        default:
          break;
      }
    }
  }

  shouldComponentUpdate(next) {
    return this.props.node !== next.node;
  }

  componentWillUnmount() {
    this.transition.stop();
  }

  onAppear({ prevYScale, currYScale, node: { data }, duration }) {
    const beg = `translate(0,${prevYScale(data)})`;
    const end = `translate(0,${currYScale(data)})`;

    const interp0 = interpolateTransformSvg(beg, end);
    const interp1 = interpolateNumber(1e-6, 1);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;

      this.tick.setAttribute('transform', interp0(t));
      this.tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  onUpdate({ currYScale, node: { data }, duration }) {
    const beg = this.tick.getAttribute('transform');
    const end = `translate(0,${currYScale(data)})`;

    const interp0 = interpolateTransformSvg(beg, end);
    const interp1 = interpolateNumber(this.tick.getAttribute('opacity'), 1);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;

      this.tick.setAttribute('transform', interp0(t));
      this.tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  onRemove({ currYScale, node: { udid, data }, removeNode, duration }) {
    const beg = this.tick.getAttribute('transform');
    const end = `translate(0,${currYScale(data)})`;

    const interp0 = interpolateTransformSvg(beg, end);
    const interp1 = interpolateNumber(this.tick.getAttribute('opacity'), 1e-6);

    this.transition = timer((elapsed) => {
      const t = elapsed < duration ? (elapsed / duration) : 1;

      this.tick.setAttribute('transform', interp0(t));
      this.tick.setAttribute('opacity', interp1(t));

      if (t === 1) {
        this.transition.stop();
        removeNode(udid);
      }
    });
  }

  render() {
    const { currXScale, node: { data } } = this.props;
    const classes = this.context.styleManager.render(styleSheet);

    return (
      <g ref={(d) => { this.tick = d; }}>
        <line
          x1={0} y1={0}
          x2={currXScale.range()[1]} y2={0}
          className={classes.line}
        />
        <text
          fontSize={'9px'}
          textAnchor="end"
          dy=".35em"
          x={-5} y={0}
          className={classes.text}
        >{numberFormat(data)}</text>
      </g>
    );
  }
}

const Ticks = withManagedData(Tick);

const ManagedTicks = (props) => {
  return <Ticks data={props.yTicks} {...props} />;
};

ManagedTicks.propTypes = {
  yTicks: PropTypes.array.isRequired,
};

ManagedTicks.defaultProps = {
  yTicks: [],
};

export default ManagedTicks;
