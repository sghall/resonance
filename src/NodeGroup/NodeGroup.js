// @flow weak
/* eslint max-len: "off" */

import React, { PureComponent } from 'react';
import now from 'performance-now';
import RAF from 'raf';
import PropTypes from 'prop-types';
import dataUpdate from '../core/dataUpdate';
import mergeNodes from '../core/mergeNodes';
import Node from '../InternalNode';
// import Node from '../Node';

export default class NodeGroup extends PureComponent {
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
     * Function that is used to render the current state of each node.  Passed the data, state, index, and type (ENTER, UPDATE or LEAVE).
     */
    render: PropTypes.func,
    /**
     * The wrapper component for the nodes. Can be a custom component or 'div', 'span', etc.
     */
    component: PropTypes.any,
    /**
     * String class name for the wrapper component.
     */
    className: PropTypes.string,
  };

  static defaultProps = {
    start: () => {},
    enter: () => {},
    update: () => {},
    leave: () => {},
    render: () => null,
    component: 'g',
    className: 'node-group',
  };

  state = dataUpdate(this.props.data, {}, this.props.keyAccessor);

  componentWillMount() {
    this.unmounting = false;
    this.animationID = null;
    this.lastRenderTime = 0;
  }

  componentDidMount() {
    this.updateNodes(this.props);
    this.ranFirst = true;
  }

  componentWillReceiveProps(next) {
    this.updateNodes(next);
  }

  componentWillUnmount() {
    this.unmounting = true;
    if (this.animationID != null) {
      RAF.cancel(this.animationID);
      this.animationID = null;
    }
  }

  updateNodes(props) {
    const { data, start, keyAccessor } = props;
    const noChanges = this.props.data === data;

    if (this.ranFirst && noChanges) {
      return;
    }

    const currKeyIndex = {};
    const currNodeKeys = this.nodeKeys;

    for (let i = 0; i < currNodeKeys.length; i++) {
      currKeyIndex[currNodeKeys[i]] = i;
    }

    const nextKeyIndex = {};
    const nextNodeKeys = [];

    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const k = keyAccessor(d);

      nextKeyIndex[k] = i;

      if (!currKeyIndex[k]) {
        const s = start(d, i);
        const n = new Node(s, d, 'ENTER');
        this.nodeHash[k] = n;
        nextNodeKeys.push(k);
      }
    }

    for (let i = 0; i < currNodeKeys.length; i++) {
      const k = currNodeKeys[i];
      const n = this.nodeHash[k];

      if (nextKeyIndex[k]) {
        const d = data[nextKeyIndex[k]];
        n.update(d, 'UPDATE');
      } else {
        const d = n.data;
        n.update(d, 'LEAVE');
      }
    }

    this.nodeKeys = mergeNodes(
      currNodeKeys,
      currKeyIndex,
      nextNodeKeys,
      nextKeyIndex,
    );

    this.renderProgress();
    this.animate();
  }

  animate() {
    if (this.unmounting) {
      return;
    }

    if (this.animationID) {
      return;
    }

    this.animationID = RAF(() => {
      if (this.unmounting) {
        return;
      }

      const needsAnimation = this.nodeKeys.reduce((d, item) => {
        return d || item.progress < 1;
      }, false);

      if (!needsAnimation) {
        this.animationID = null;
        this.wasAnimating = false;

        return;
      }

      this.wasAnimating = true;

      const currentTime = now();
      // const timeSinceLastFrame = currentTime - this.lastRenderTime;

      this.renderProgress();
      this.lastRenderTime = currentTime;
      this.animationID = null;
      this.animate();
    });
  }

  removeKey = (dkey) => {
    this.setState((prevState, props) => {
      const index0 = prevState.nodes
        .findIndex((d) => props.keyAccessor(d) === dkey);

      const index1 = props.data
        .findIndex((d) => props.keyAccessor(d) === dkey);

      if (index0 >= 0 && index1 === -1) {
        const dkeys = Object.assign({}, prevState.dkeys);
        delete dkeys[dkey];

        return {
          dkeys,
          nodes: [
            ...prevState.nodes.slice(0, index0),
            ...prevState.nodes.slice(index0 + 1),
          ],
        };
      }

      return prevState;
    });
  }

  lazyRemoveKey = (dkey) => {
    this.setState((prevState) => ({
      removed: Object.assign({}, prevState.removed, { [dkey]: true }),
    }));
  }

  nodeHash = {};
  nodeKeys = [];

  renderProgress() {
    const nodes = this.nodeHash;

    this.setState({ items: nodes });
  }

  render() {
    const { props: {
      // data,
      // start,
      // enter,
      // update,
      // leave,
      // render,
      component,
      className,
      keyAccessor,
    }, state } = this;

    return React.createElement(
      component,
      { className },
      state.nodes.map((node, index) => {
        const dkey = keyAccessor(node);
        const type = state.dkeys[dkey];

        return (
          <g key={dkey} transform={`translate(-300,${index * 20})`}>
            <text fontSize="10px">{dkey}</text>
            <text dy="10px" fontSize="10px">{type}</text>
          </g>
        );
      }),
    );
  }
}
