// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import defaultKeyAccessor from '../core/defaultKeyAccessor';
import defaultComposeNode from '../core/defaultComposeNode';
import dataUpdate from '../core/dataUpdate';

const propTypes = {
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

export default class NodeGroup extends PureComponent {
  static propTypes = propTypes;

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
    const { props: { keyAccessor, className, nodeComponent: Node }, state } = this;

    const props = Object.assign({}, this.props);

    Object.keys(propTypes).forEach((prop) => {
      delete props[prop];
    });

    return (
      <g className={className}>
        {state.nodes.map((node) => {
          const udid = keyAccessor(node);
          const type = state.udids[udid];

          return (
            <Node
              key={udid}
              udid={udid}
              type={type}
              node={node}
              removeNode={this.removeNode}
              {...props}
            />
          );
        })}
      </g>
    );
  }
}
