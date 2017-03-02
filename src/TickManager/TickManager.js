// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import Immutable from 'immutable';
import defaultKeyAccessor from '../core/defaultKeyAccessor';
import defaultComposeNode from '../core/defaultComposeNode';
import dataUpdate from '../core/dataUpdate';

const UNMOUNTED = 'UNMOUNTED';

export default class NodeManager extends PureComponent {
  static propTypes = {
    scale: PropTypes.func.isRequired,
    keyAccessor: PropTypes.func,
    composeNode: PropTypes.func,
    tickComponent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    keyAccessor: defaultKeyAccessor,
    composeNode: defaultComposeNode,
  };

  constructor(props) {
    super(props);

    this.state = {
      ticks: new Immutable.OrderedMap(),
      prevScale: () => {},
      currScale: () => {},
    };

    this.removeTick = this.removeTick.bind(this);
    this.removalQueue = [];
    this.processQueue = this.processQueue.bind(this);
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
    const { props: { tickComponent: Tick, ...rest }, state: { ticks } } = this;

    return (
      <g>
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
