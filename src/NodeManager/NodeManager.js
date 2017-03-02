// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import Immutable from 'immutable';
import debounce from 'lodash/debounce';
import defaultKeyAccessor from '../core/defaultKeyAccessor';
import defaultComposeNode from '../core/defaultComposeNode';
import dataUpdate from '../core/dataUpdate';

let time = performance.now();

export default class NodeManager extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    keyAccessor: PropTypes.func,
    composeNode: PropTypes.func,
    nodeComponent: PropTypes.func,
  };

  static defaultProps = {
    keyAccessor: defaultKeyAccessor,
    composeNode: defaultComposeNode,
  };

  constructor(props) {
    super(props);

    this.state = { nodes: new Immutable.OrderedMap() };
    this.removeNode = debounce(this.removeNode.bind(this));
  }

  componentDidMount() {
    if (this.props.data) {
      this.updateNodes(this.props);
    }
  }

  componentWillReceiveProps(next) {
    if (this.props.data !== next.data) {
      this.updateNodes(next);
    }
  }

  updateNodes(props) {
    this.setState({ nodes: dataUpdate(props, this.state.nodes) });
  }

  removeNode(udid) {
    console.log(udid);
    const { nodes } = this.state;
    this.setState({ nodes: nodes.delete(udid) });
  }

  render() {
    const { props: { nodeComponent: Node, ...rest }, state: { nodes } } = this;
    console.log('render!!!!');

    return (
      <g>
        {nodes.map((node) => {
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
