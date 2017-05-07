// @flow weak
/* eslint max-len: "off" */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dataUpdate from '../core/dataUpdate';
import Tick from '../Tick';

const keyAccessor = (d) => `tick-${d.val}`;

export default class TickGroup extends PureComponent {
  static propTypes = {
    /**
     * A [contunous D3 scale](https://github.com/d3/d3-scale#continuous-scales) (i.e. has a "ticks" function). The scale prop is treated as immutable so the ticks will only update if prev.scale !== next.scale.
     */
    scale: PropTypes.func.isRequired,
    /**
     * Approximate numbe of ticks to be rendered.
     */
    tickCount: PropTypes.number,
    /**
     * A function that returns the starting state.   The function is passed the tick (the tick is pass as an object i.g. { val: 10.5 }) and index.
     */
    start: PropTypes.func.isRequired,
    /**
     * A function that **returns an object or array of objects** describing how the state should transform on enter.  The function is passed the tick (the tick is pass as an object i.g. { val: 10.5 }) and index.
     */
    enter: PropTypes.func,
    /**
     * A function that **returns an object or array of objects** describing how the state should transform on update.  The function is passed the tick (the tick is pass as an object i.g. { val: 10.5 }) and index.
     */
    update: PropTypes.func,
    /**
     * A function that **returns an object or array of objects** describing how the state should transform on leave.  The function is passed the tick (the tick is pass as an object i.g. { val: 10.5 }), index and remove function to be called when you want to remove the node.
     */
    leave: PropTypes.func,
    /**
     * Function that is used to render the current state of each tick.  Passed the tick, state, index, and type (ENTER, UPDATE or LEAVE).
     */
    render: PropTypes.func.isRequired,
    /**
     * The wrapper component for the ticks. Can be a custom component or 'div', 'span', etc.
     */
    component: PropTypes.any,
    /**
     * String class name for the wrapper component.
     */
    className: PropTypes.string,
  };

  static defaultProps = {
    enter: () => {},
    update: () => {},
    leave: () => {},
    component: 'g',
    tickCount: 10,
    className: 'tick-group',
  };

  state = {
    nodes: [],
    udids: {},
    cache: null,
    removed: {},
  }

  componentDidMount() {
    this.updateTicks(this.props, this.props);
  }

  componentWillReceiveProps(next) {
    if (this.props.scale !== next.scale) {
      this.updateTicks(this.props, next);
    }
  }

  updateTicks(prev, next) {
    const { tickCount, scale } = next;
    const ticks = scale.ticks ? scale.ticks(tickCount) : [];

    this.setState((prevState) => {
      const mapped = ticks.map((tick) => ({ val: tick }));
      const update = dataUpdate(mapped, prevState, keyAccessor);
      return { ...update, cache: prev.scale };
    });
  }

  removeKey = (udid) => {
    this.setState((prevState, props) => {
      const index0 = prevState.nodes
        .findIndex((d) => keyAccessor(d) === udid);

      const index1 = props.scale.ticks ? props.scale.ticks(props.tickCount) : []
        .findIndex((d) => keyAccessor(d) === udid);

      if (index0 >= 0 && index1 === -1) {
        const udids = Object.assign({}, prevState.udids);
        delete udids[udid];

        return {
          udids,
          nodes: [
            ...prevState.nodes.slice(0, index0),
            ...prevState.nodes.slice(index0 + 1),
          ],
        };
      }

      return prevState;
    });
  }

  lazyRemoveKey = (udid) => {
    this.setState((prevState) => ({
      removed: Object.assign({}, prevState.removed, { [udid]: true }),
    }));
  }

  render() {
    const { props: {
      scale,
      start,
      enter,
      update,
      leave,
      render,
      component,
      className,
    }, state } = this;

    return React.createElement(
      component,
      { className },
      state.nodes.map((node, index) => {
        const udid = keyAccessor(node);
        const type = state.udids[udid];

        return (
          <Tick
            key={udid}

            scale={scale}
            cache={state.cache}

            udid={udid}
            type={type}
            node={node}
            index={index}

            start={start}

            enter={enter}
            update={update}
            leave={leave}

            render={render}

            removeKey={this.removeKey}
            lazyRemoveKey={this.lazyRemoveKey}
          />
        );
      }),
    );
  }
}
