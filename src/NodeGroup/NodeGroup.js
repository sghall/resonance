// @flow weak
/* eslint max-len: "off" */

import React, { Component } from 'react';
import { interval } from 'd3-timer';
import PropTypes from 'prop-types';
import Node from '../Node';
import mergeKeys from '../core/mergeKeys';
import { ENTER, UPDATE, LEAVE } from '../core/types';
import { transition, stop } from '../core/transition';

const msPerFrame = 1000 / 60;

class NodeGroup extends Component {
  static propTypes = {
    /**
     * An array of data objects.  The data prop is treated as immutable so the nodes will only update if prev.data !== next.data.
     */
    data: PropTypes.array.isRequired,
    /**
     * Function that returns a string key given a data object.  Used to track which nodes are entering, updating and leaving.
     */
    keyAccessor: PropTypes.func.isRequired,
    /**
     * A function that returns the starting state.  The function is passed the data and index.
     */
    start: PropTypes.func,
    /**
     * A function that **returns an object or array of objects** describing how the state should transform on enter.  The function is passed the data and index.
     */
    enter: PropTypes.func,
    /**
     * A function that **returns an object or array of objects** describing how the state should transform on update.  The function is passed the data and index.
     */
    update: PropTypes.func,
    /**
     * A function that **returns an object or array of objects** describing how the state should transform on leave.  The function is passed the data, index and remove function to be called when you want to remove the node.
     */
    leave: PropTypes.func,
    /**
     * A function that renders the nodes.  The function is passed an array of nodes.
     */
    children: PropTypes.func,
  };

  static defaultProps = {
    start: () => {},
    enter: () => {},
    update: () => {},
    leave: () => {},
  };

  state = {
    nodes: [],
  }

  componentDidMount() {
    this.updateNodes(this.props);
  }

  componentWillReceiveProps(next) {
    this.updateNodes(next);
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

  updateNodes(props) {
    const { data, start, enter, update, leave, keyAccessor } = props;
    const noChanges = this.props.data === data;

    if (this.ranFirst && noChanges) {
      return;
    }

    const currKeyIndex = {};
    const currNodeKeys = this.nodeKeys;
    const currNodeKeysLength = this.nodeKeys.length;

    for (let i = 0; i < currNodeKeysLength; i++) {
      currKeyIndex[currNodeKeys[i]] = i;
    }

    const nextKeyIndex = {};
    const nextNodeKeys = [];

    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const k = keyAccessor(d);

      nextKeyIndex[k] = i;
      nextNodeKeys.push(k);

      if (currKeyIndex[k] === undefined) {
        const n = new Node(k, d, ENTER);
        this.nodeHash[k] = n;
      }
    }

    for (let i = 0; i < currNodeKeysLength; i++) {
      const k = currNodeKeys[i];
      const n = this.nodeHash[k];

      if (nextKeyIndex[k] !== undefined) {
        const d = data[nextKeyIndex[k]];
        n.update(d, UPDATE);
      } else {
        const d = n.data;
        n.update(d, LEAVE);
      }
    }

    this.nodeKeys = mergeKeys(
      currNodeKeys,
      currKeyIndex,
      nextNodeKeys,
      nextKeyIndex,
    );

    for (let i = 0; i < this.nodeKeys.length; i++) {
      const k = this.nodeKeys[i];
      const n = this.nodeHash[k];
      const d = n.data;

      if (n.type === ENTER) {
        n.setState(start(d, i));
        transition.call(n, enter(d, i));
      } else if (n.type === LEAVE) {
        transition.call(n, leave(d, i));
      } else {
        transition.call(n, update(d, i));
      }
    }

    if (this.interval) {
      this.interval.stop();
    }

    this.interval = interval(this.animate);
    this.renderNodes();
  }

  animate = () => {
    if (this.unmounting) {
      return;
    }

    let pending = false;

    const nextNodeKeys = [];
    const length = this.nodeKeys.length;

    for (let i = 0; i < length; i++) {
      const k = this.nodeKeys[i];
      const n = this.nodeHash[k];

      if (n.TRANSITION_SCHEDULES) {
        pending = true;
      }

      if (n.type === LEAVE && !n.TRANSITION_SCHEDULES) {
        delete this.nodeHash[k];
      } else {
        nextNodeKeys.push(k);
      }
    }

    if (!pending) {
      this.interval.stop();
    }

    this.nodeKeys = nextNodeKeys;
    this.renderNodes();
  }

  nodeHash = {};
  nodeKeys = [];
  interval = null;
  unmounting = false;

  renderNodes() {
    this.setState({
      nodes: this.nodeKeys.map((key) => {
        return this.nodeHash[key];
      }),
    });
  }

  render() {
    const renderedChildren = this.props.children(this.state.nodes);
    return renderedChildren && React.Children.only(renderedChildren);
  }
}

export default NodeGroup;
