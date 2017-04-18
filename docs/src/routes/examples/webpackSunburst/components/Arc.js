// @flow weak

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { arcTween } from './utils';
import { COLORS } from '../module/constants';

class Arc extends Component {
  static propTypes = {
    data: PropTypes.shape({
      x0: PropTypes.number.isRequired,
      x1: PropTypes.number.isRequired,
      y0: PropTypes.number.isRequired,
      y1: PropTypes.number.isRequired,
      depth: PropTypes.number.isRequired,
      filePath: PropTypes.array.isRequired,
    }).isRequired,
    path: PropTypes.func.isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
    setActiveNode: PropTypes.func.isRequired,
    setActivePath: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    (this:any).handleMouseOver = props.setActivePath.bind(this, props.data.filePath);
    (this:any).handleMouseOut = props.setActivePath.bind(this, []);
    (this:any).handleClick = this.handleClick.bind(this);
  }

  state = {
    path: {
      strokeOpacity: 0.6,
      d: this.props.path(this.props.data),
    },
  }

  onUpdate() {
    const { data, path, duration } = this.props;

    // a little optimization - avoids transitions on unseen arcs :)
    if (data.noTransition) {
      return this.setState({
        path: { d: path(data), strokeOpacity: 1e-6 },
      });
    }

    return {
      path: {
        strokeOpacity: data.angle === 0 ? [1e-6] : 0.6,
        d: arcTween(data),
      },
      timing: { duration },
    };
  }

  handleClick() {
    const { setActiveNode, data } = this.props;
    setActiveNode(data);
  }

  handleMouseOver = null;
  handleMouseOut = null;

  render() {
    const { data: { noTransition, depth } } = this.props;

    return (
      <path
        style={{ cursor: 'pointer' }}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onClick={this.handleClick}
        fill={COLORS[depth]}
        opacity={noTransition ? 1e-6 : 0.6}
        stroke="white"
        strokeWidth={0.5}
        {...this.state.path}
      />
    );
  }
}

export default Arc;

