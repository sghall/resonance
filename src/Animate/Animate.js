// @flow weak
/* eslint max-len: "off" */

import React, { Component } from 'react';
import { interval } from 'd3-timer';
import Node from '../Node';
import { ENTER, UPDATE, LEAVE } from '../core/types';
import { transition, stop } from '../core/transition';

type Props = {
  /**
   * A data object.  The data prop is treated as immutable so the node will update if prev.data !== next.data.
   */
  data?: {},
  /**
  * A function that returns the starting state.  The function is passed the data and must return an object.
  */
  start: (data: {}) => {} | Array<{}>,
  /**
   * A function that **returns an object or array of objects** describing how the state should transform on update.  The function is passed the data.
   */
  enter?: (data: {}) => {} | Array<{}>,
  /**
   * A function that **returns an object or array of objects** describing how the state should transform on update.  The function is passed the data.
   */
  update?: (data: {}) => {} | Array<{}>,
  /**
   * A function that **returns an object or array of objects** describing how the state should transform on leave.  The function receives no parameters.  You trigger a leave transition by sending data as null or undefined.
   */
  leave?: (data: {}) => {} | Array<{}>,
  /**
   * A function that renders the node. It should accept a single node as its only argument.  The node is an object with the data, state and a type of 'ENTER', 'UPDATE'.
   */
  children: (nodes: Array<{}>) => {},
};

class Animate extends Component {

  static defaultProps = {
    enter: () => {},
    update: () => {},
    leave: () => {},
  };

  state = {
    node: {},
  }

  componentDidMount() {
    this.updateNode(this.props);
  }

  componentWillReceiveProps(next) {
    if (next.data === undefined || next.data !== this.props.data) {
      this.updateNode(next);
    }
  }

  componentWillUnmount() {
    this.unmounting = true;

    if (this.interval) {
      this.interval.stop();
    }

    this.nodeKeys.forEach((key) => {
      stop.call(this.nodeHash[key]);
    });
  }

  props: Props;

  updateNode(props) {
    const { data, start, enter, update, leave } = props;

    if (this.node === null) {
      this.node = new Node(null, data, ENTER);
      this.node.setState(start(data));
      transition.call(this.node, enter(data));
    } else if (data === undefined) {
      this.node.updateType(LEAVE);
      transition.call(this.node, leave(data));
    } else {
      this.node.updateType(UPDATE);
      transition.call(this.node, update(data));
    }

    if (!this.interval) {
      this.interval = interval(this.animate);
    } else {
      this.interval.restart(this.animate);
    }

    this.renderNode();
  }

  animate = () => {
    if (this.unmounting) {
      return;
    }

    let pending = false;

    if (this.node.TRANSITION_SCHEDULES) {
      pending = true;
    }

    if (!pending) {
      this.interval.stop();
    }

    this.renderNode();
  }

  node = null;
  interval = null;
  unmounting = false;

  renderNode() {
    this.setState(() => ({
      node: this.node,
    }));
  }

  render() {
    const renderedChildren = this.props.children(this.state.node);
    return renderedChildren && React.Children.only(renderedChildren);
  }
}

export default Animate;
