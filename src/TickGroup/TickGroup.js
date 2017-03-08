// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import defaultKeyAccessor from '../core/defaultKeyAccessor';
import defaultComposeNode from '../core/defaultComposeNode';
import dataUpdate from '../core/dataUpdate';

export default class TickGroup extends PureComponent {
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
    tickCount: PropTypes.number,
    /**
     * Set to false to disable rounded corners.
     */
    tickComponent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tickCount: 10,
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
    const { tickCount, scale } = next;
    const ticks = scale.ticks ? scale.ticks(tickCount) : [];

    this.setState((prevState) => {
      const update = dataUpdate({ data: ticks, ...next }, prevState, this.removed);
      return { ...update, prevScale: prev.scale, currScale: scale };
    });
  }

  removeTick(udid) {
    this.removed.set(udid, true);
  }

  render() {
    const { props: { className, tickComponent: Tick, ...rest }, state } = this;

    return (
      <g className={className}>
        {state.nodes.map((tick) => {
          return (
            <Tick
              key={tick.udid}
              tick={tick}
              removeTick={this.removeTick}
              prevScale={state.prevScale}
              currScale={state.currScale}
              {...rest}
            />
          );
        })}
      </g>
    );
  }
}
