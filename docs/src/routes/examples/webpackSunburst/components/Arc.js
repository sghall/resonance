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
    }).isRequired,
    path: PropTypes.func.isRequired,
    duration: PropTypes.number.isRequired,
    removeNode: PropTypes.func.isRequired,
    clickHandler: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    (this:any).clickHandler = this.clickHandler.bind(this);
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

  clickHandler() {
    this.props.clickHandler(this.props.data);
  }

  render() {
    const { data } = this.props;

    return (
      <path
        style={{ cursor: 'pointer' }}
        onClick={this.clickHandler}
        fill={COLORS[data.depth]}
        opacity={data.noTransition ? 1e-6 : 0.6}
        stroke="white"
        strokeWidth={0.5}
        {...this.state.path}
      >
        <title>{data.filePath}</title>
      </path>
    );
  }
}

export default Arc;

