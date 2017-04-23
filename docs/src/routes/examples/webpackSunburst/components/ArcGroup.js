// @flow weak
/* eslint no-nested-ternary:"off" */

import React, { PureComponent } from 'react';
import { easeLinear } from 'd3-ease';
import PropTypes from 'prop-types';
import createNodeGroup from 'resonance/createNodeGroup';
import { arcTween } from '../module/scales';
import { COLORS } from '../module/constants';

class Arc extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      x0: PropTypes.number.isRequired,
      x1: PropTypes.number.isRequired,
      y0: PropTypes.number.isRequired,
      y1: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      depth: PropTypes.number.isRequired,
      filePath: PropTypes.string.isRequired,
    }).isRequired,
    path: PropTypes.func.isRequired,
    duration: PropTypes.number.isRequired,
    remove: PropTypes.func.isRequired,
    setActiveNode: PropTypes.func.isRequired,
    activePath: PropTypes.string.isRequired,
    setActivePath: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { data: { filePath, value } } = props;

    (this:any).handleMouseOver = props.setActivePath.bind(this, filePath, value);
    (this:any).handleMouseOut = props.setActivePath.bind(this, '', undefined);
    (this:any).handleClick = this.handleClick.bind(this);
  }

  state = {
    path: {
      strokeOpacity: 0.6,
      d: this.props.path(this.props.data),
    },
  }

  match = new RegExp(`^${this.props.data.filePath}(\/|$)`, 'g') // eslint-disable-line

  onUpdate() {
    const { data, path, duration } = this.props;

    // optimization - avoids transitions on arc that are not visible
    if (data.noTransition) {
      return {
        path: {
          strokeOpacity: 0.6,
          d: path(data), // returns string value
        },
      };
    }

    return {
      path: {
        strokeOpacity: data.angle === 0 ? [1e-6] : 0.6,
        d: arcTween(data),  // returns custom tween
      },
      timing: { duration, ease: easeLinear },
    };
  }

  onExit() {
    this.props.remove();
  }

  handleClick() {
    const { setActiveNode, data } = this.props;
    setActiveNode(data);
  }

  handleMouseOver = null;
  handleMouseOut = null;

  render() {
    const { activePath, data: { noTransition, angle, depth } } = this.props;
    const active = activePath.match(this.match);

    return (
      <path
        style={{ cursor: 'pointer' }}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onClick={this.handleClick}
        fill={COLORS[depth]}
        opacity={noTransition ? 1e-6 : active ? 1 : 0.3}
        stroke={active ? 'blue' : angle < 0.01 ? 'none' : 'white'}
        strokeWidth={0.5}
        {...this.state.path}
      />
    );
  }
}

export default createNodeGroup(Arc, 'g', (d) => d.filePath);

