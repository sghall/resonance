// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import Immutable from 'immutable';
import defaultKeyAccessor from '../core/defaultKeyAccessor';
import defaultComposeNode from '../core/defaultComposeNode';
import dataUpdate from '../core/dataUpdate';

const UNMOUNTED = 'UNMOUNTED';

export default class NodeManager extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    keyAccessor: PropTypes.func,
    composeNode: PropTypes.func,
    nodeComponent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    keyAccessor: defaultKeyAccessor,
    composeNode: defaultComposeNode,
  };

  constructor(props) {
    super(props);

    this.state = {
      nodes: new Immutable.OrderedMap(),
    };

    this.removeNode = this.removeNode.bind(this);
    this.removalQueue = [];
    this.processQueue = this.processQueue.bind(this);
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
    const { props: { nodeComponent: Node, ...rest }, state: { nodes } } = this;

    return (
      <g>
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
