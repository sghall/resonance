// @flow weak

import React, { Component, PropTypes } from 'react';

export const APPEAR = 'APPEAR';
export const UPDATE = 'UPDATE';
export const REMOVE = 'REMOVE';
export const REVIVE = 'REVIVE';

const keyAccessor = (d, i) => {
  if (typeof d === 'number' || typeof d === 'string') {
    return d;
  }

  if (d.udid) {
    return d.udid;
  }

  return i;
};

const composeNode = (data, type, udid) => {
  if (typeof data === 'number' || typeof data === 'string') {
    return { data, type, udid };
  }

  return { ...data, type, udid };
};

export function withSelection(SelectionItem) {
  class Selection extends Component {
    constructor(props) {
      super(props);

      this.state = {
        nodes: [],
        udids: {},
      };
    }

    componentWillReceiveProps(next) {
      if (this.props.data !== next.data) {
        this.updateNodes(this.props);
      }
    }

    updateNodes(data) {
      const nodes = [];
      const udids = {};

      for (let i = 0, len = data.length; i < len; i++) {
        const udid = keyAccessor(data[i], i, data);

        let type = APPEAR;

        if (this.state.udids[udid]) {
          if (this.state.udids[udid] === REMOVE) {
            type = REVIVE;
          } else {
            type = UPDATE;
          }
        }

        nodes.push(composeNode(data[i], type, udid));
        udids[udid] = type;
      }


      for (let i = 0, len = this.state.nodes; i < len; i++) {
        const node = this.state.nodes[i];

        if (udids[node.udid]) {
          nodes.push(composeNode(node, REMOVE, node.udid));
        }
      }

      this.setState({ nodes, udids });
    }

    render() {
      return (
        <g>
          {this.state.nodes.map((node) => {
            return <SelectionItem node={node} {...this.props} />;
          })}
        </g>
      );
    }
  }

  Selection.propTypes = {
    data: PropTypes.array,
    keyAccessor: PropTypes.func,
    composeNode: PropTypes.func,
  };

  Selection.defaultProps = {
    keyAccessor,
    composeNode,
  };

  return Selection;
}
