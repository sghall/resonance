// @flow weak
/* eslint max-len: "off" */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NodeGroup from '../NodeGroup';

const tickKeyAccessor = (d) => `tick-${d.val}`;

class TickGroup extends Component {
  static propTypes = {
    /**
     * A [contunous D3 scale](https://github.com/d3/d3-scale#continuous-scales) (i.e. has a "ticks" function). The scale prop is treated as immutable so the ticks will only update if prev.scale !== next.scale.
     */
    scale: PropTypes.func.isRequired,
    /**
     * Approximate number of ticks to be rendered. This is passed directly through to the D3 scale ticks function.
     */
    tickCount: PropTypes.number,
    /**
     * A function that returns the starting state.   The function is passed the tick (the tick is pass as an object i.g. { val: 10.5 }) and index.
     */
    start: PropTypes.func,
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
     * A function that renders the nodes.  The function is passed an array of nodes.
     */
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    start: () => {},
    enter: () => {},
    update: () => {},
    leave: () => {},
  };

  state = {
    ticks: [],
  }

  componentDidMount() {
    const { scale, tickCount } = this.props;
    const ticks = scale.ticks ? scale.ticks(tickCount) : [];
    this.updateTicks(ticks.map((d) => ({ val: d })));
  }

  componentWillReceiveProps(next) {
    if (next.scale !== this.props.scale) {
      const { scale, tickCount } = next;
      const ticks = scale.ticks ? scale.ticks(tickCount) : [];
      this.updateTicks(ticks.map((d) => ({ val: d })));
    }
  }

  updateTicks(ticks) {
    this.setState(() => ({ ticks }));
  }

  render() {
    const { start, enter, update, leave, children } = this.props;

    return (
      <NodeGroup
        data={this.state.ticks}
        keyAccessor={tickKeyAccessor}
        start={start}
        enter={enter}
        update={update}
        leave={leave}
      >
        {children}
      </NodeGroup>
    );
  }
}

export default TickGroup;

