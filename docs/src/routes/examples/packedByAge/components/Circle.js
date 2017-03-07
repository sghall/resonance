// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import transition from 'resonance/core/transition';
import NodeGroup from 'resonance/NodeGroup';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { APPEAR, UPDATE, REMOVE, REVIVE } from 'resonance/core/types';

const styleSheet = createStyleSheet('Circle', (theme) => {
  return {
    circle: {
      fill: theme.palette.accent[500],
      opacity: 0.8,
      '&:hover': {
        opacity: 0.5,
      },
    },
    text: {
      fontSize: 12,
      textAnchor: 'middle',
      fill: theme.palette.text.secondary,
    },
  };
});

export default class Circle extends PureComponent {
  static propTypes = {
    node: PropTypes.shape({
      udid: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      data: PropTypes.object.isRequired,
      r: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      children: PropTypes.array, // Leaf nodes have no children
    }).isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
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

  node = null;   // Root node ref set in render method
  circle = null; // Circle node ref set in render method

  onAppear({ duration, node: { r, x, y, depth } }) {
    this.transition({
      node: {
        opacity: [1e-6, 0.8],
        transform: `translate(${x},${y})`,
      },
      circle: { fill: depth === 1 ? 'tomato' : 'blue', r: [1e-6, r] },
    }, { duration });
  }

  onUpdate({ duration, node: { r, x, y } }) {
    this.transition({
      node: {
        opacity: [0.8],
        transform: [`translate(${x},${y})`],
      },
      circle: { r: [r] },
    }, { duration });
  }

  onRemove({ duration, node: { udid, x, y }, removeNode }) {
    this.transition({
      node: {
        opacity: [1e-6],
        transform: [`translate(${x},${y})`],
      },
      circle: { fill: 'grey', r: [1e-6] },
    }, { duration }, {
      end: () => {
        removeNode(udid);
      },
    });
  }

  render() {
    const { node: { udid } } = this.props;
    const classes = this.context.styleManager.render(styleSheet);

    return (
      <g>
        <g ref={(d) => { this.node = d; }}>
          <title>{udid}</title>
          <circle ref={(d) => { this.circle = d; }} />
          <text className={classes.text} dy="0.3em">{''}</text>
        </g>
      </g>
    );
  }
}
