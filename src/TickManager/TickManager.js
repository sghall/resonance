// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import defaultKeyAccessor from '../core/defaultKeyAccessor';
import defaultComposeNode from '../core/defaultComposeNode';
import nodeUpdate from '../core/nodeUpdate';

export default class TickManager extends PureComponent {
  static propTypes = {
    /**
     * The CSS class name of the root element.
     */
    scale: PropTypes.func.isRequired,
    /**
     * The CSS class name of the root element.
     */
    className: PropTypes.string,
    /**
     * The CSS class name of the root element.
     */
    keyAccessor: PropTypes.func,
    /**
     * Shadow depth, corresponds to `dp` in the spec.
     */
    composeNode: PropTypes.func,
    /**
     * Set to false to disable rounded corners.
     */
    tickComponent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    keyAccessor: defaultKeyAccessor,
    composeNode: defaultComposeNode,
  };

  constructor(props) {
    super(props);

    (this:any).removeTick = this.removeTick.bind(this);
  }

  state = {
    nodes: [],
    udids: {},
    prevScale: () => {},
    currScale: () => {},
  }

  componentDidMount() {
    this.updateTicks(this.props, this.props);
  }

  componentWillReceiveProps(next) {
    if (this.props.scale !== next.scale) {
      this.updateTicks(this.props, next);
    }
  }

  removed = new Map();

  updateTicks(prev, next) {
    const ticks = next.scale.ticks ? next.scale.ticks() : [];

    this.setState((prevState) => {
      const update = nodeUpdate({ data: ticks, ...next }, prevState, this.removed);
      return { ...update, prevScale: prev.scale, currScale: next.scale };
    });
  }

  removeTick(udid) {
    this.removed.set(udid, true);
  }

  render() {
    const { props: { className, tickComponent: Tick, ...rest }, state: { nodes } } = this;

    return (
      <g className={className}>
        {nodes.map((tick) => {
          return (
            <Tick
              key={tick.udid}
              tick={tick}
              removeTick={this.removeTick}
              prevScale={this.state.prevScale}
              currScale={this.state.currScale}
              {...rest}
            />
          );
        })}
      </g>
    );
  }
}
