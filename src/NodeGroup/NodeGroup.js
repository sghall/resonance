// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import defaultKeyAccessor from '../core/defaultKeyAccessor';
import defaultComposeNode from '../core/defaultComposeNode';
import dataUpdate from '../core/dataUpdate';

export default class NodeGroup extends PureComponent {
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
  }

  state = {
    nodes: [],
    udids: {},
  }

  componentDidMount() {
    this.updateNodes(this.props);
  }

  componentWillReceiveProps(next) {
    if (this.props.data !== next.data) {
      this.updateNodes(next);
    }
  }

  removed = new Map();

  updateNodes(props) {
    this.setState((prevState) => {
      return dataUpdate(props, prevState, this.removed);
    });
  }

  removeNode(udid) {
    this.removed.set(udid, true);
  }

  render() {
    const { props: { className, nodeComponent: Node, ...rest }, state } = this;

    return (
      <g className={className}>
        {state.nodes.map((node) => {
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
