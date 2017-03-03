// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import * as Immutable from 'immutable';
import defaultKeyAccessor from '../core/defaultKeyAccessor';
import defaultComposeNode from '../core/defaultComposeNode';
import dataUpdate from '../core/dataUpdate';

const UNMOUNTED = 'UNMOUNTED';

export default class NodeManager extends PureComponent {
  static propTypes = {
    /**
     * The CSS class name of the root element.
     */
    data: PropTypes.array.isRequired,
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
    nodeComponent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    keyAccessor: defaultKeyAccessor,
    composeNode: defaultComposeNode,
  };

  constructor(props) {
    super(props);

    (this:any).removeNode = this.removeNode.bind(this);
    (this:any).processQueue = this.processQueue.bind(this);
  }

  state = {
    nodes: new Immutable.OrderedMap(),
  }

  componentDidMount() {
    this.updateNodes(this.props);
  }

  componentWillReceiveProps(next) {
    if (this.props.data !== next.data) {
      this.updateNodes(next);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.reqID);
    this.reqID = UNMOUNTED;
  }

  removalQueue = [];
  reqID = null;

  updateNodes(props) {
    this.setState({ nodes: dataUpdate(props, this.state.nodes) });
  }

  removeNode(udid) {
    this.removalQueue.push(udid);

    if (this.removalQueue.length === 1) {
      this.reqID = requestAnimationFrame(this.processQueue);
    }
  }

  processQueue() {
    if (this.removalQueue.length > 0) {
      const nodes = this.state.nodes.withMutations((n) => {
        while (this.removalQueue.length > 0) {
          n.delete(this.removalQueue.shift());
        }
      });

      if (this.reqID === UNMOUNTED) {
        return;
      }

      this.setState({ nodes });
      this.reqID = requestAnimationFrame(this.processQueue);
    }
  }

  render() {
    const { props: { className, nodeComponent: Node, ...rest }, state: { nodes } } = this;

    return (
      <g className={className}>
        {nodes.valueSeq().map((node) => {
          return (
            <Node
              key={node.udid}
              node={node}
              removeNode={this.removeNode}
              {...rest}
            />
          );
        })}
      </g>
    );
  }
}
