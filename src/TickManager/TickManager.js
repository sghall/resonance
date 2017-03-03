// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import * as Immutable from 'immutable';
import defaultKeyAccessor from '../core/defaultKeyAccessor';
import defaultComposeNode from '../core/defaultComposeNode';
import dataUpdate from '../core/dataUpdate';

const UNMOUNTED = 'UNMOUNTED';

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
    (this:any).processQueue = this.processQueue.bind(this);
  }

  state = {
    ticks: new Immutable.OrderedMap(),
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

  componentWillUnmount() {
    cancelAnimationFrame(this.reqID);
    this.reqID = UNMOUNTED;
  }

  removalQueue = [];
  reqID = null;

  updateTicks(prev, next) {
    const ticks = next.scale.ticks ? next.scale.ticks() : [];

    this.setState({
      ticks: dataUpdate({ data: ticks, ...next }, this.state.ticks),
      prevScale: prev.scale,
      currScale: next.scale,
    });
  }

  removeTick(udid) {
    this.removalQueue.push(udid);

    if (this.removalQueue.length === 1) {
      this.reqID = requestAnimationFrame(this.processQueue);
    }
  }

  processQueue() {
    if (this.removalQueue.length > 0) {
      const ticks = this.state.ticks.withMutations((n) => {
        while (this.removalQueue.length > 0) {
          n.delete(this.removalQueue.shift());
        }
      });

      if (this.reqID === UNMOUNTED) {
        return;
      }

      this.setState({ ticks });
      this.reqID = requestAnimationFrame(this.processQueue);
    }
  }

  render() {
    const { props: { className, tickComponent: Tick, ...rest }, state: { ticks } } = this;

    return (
      <g className={className}>
        {ticks.valueSeq().map((tick) => {
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
