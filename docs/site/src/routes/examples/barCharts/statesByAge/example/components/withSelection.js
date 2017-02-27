// @flow weak

import React, { Component, PropTypes } from 'react';

export const APPEAR = 'APPEAR';
export const UPDATE = 'UPDATE';
export const REMOVE = 'REMOVE';
export const REVIVE = 'REVIVE';

const keyToString = (d) => `key-${d}`;

const keyAccessor = (d, i) => {
  if (typeof d === 'number' || typeof d === 'string') {
    return keyToString(d);
  } else if (d.id) {
    return keyToString(d.id);
  } else if (d.udid) {
    return keyToString(d.udid);
  }

  return keyToString(i);
};

const composeNode = (data, type, udid) => {
  if (typeof data === 'number' || typeof data === 'string') {
    return { data, type, udid };
  }

  return { ...data, type, udid };
};

export default function withSelection(SelectionItem) {
  class Selection extends Component {
    constructor(props) {
      super(props);

      this.state = {
        nodes: [],
        udids: {},
      };
    }

    componentDidMount() {
      if (this.props.data) {
        this.updateNodes(this.props.data);
      }
    }

    componentWillReceiveProps(next) {
      if (this.props.data !== next.data) {
        this.updateNodes(next.data);
      }
    }

    updateNodes(data) {
      const nodes = [];
      const udids = {};

      let index = 0;

      for (let len = data.length; index < len; index++) {
        const udid = keyAccessor(data[index], index, data);

        let type = APPEAR;

        if (this.state.udids[udid]) {
          if (this.state.udids[udid].type === REMOVE) {
            type = REVIVE;
          } else {
            type = UPDATE;
          }
        }

        nodes.push(composeNode(data[index], type, udid));
        udids[udid] = { type, index };
      }


      for (let i = 0, len = this.state.nodes.length; i < len; i++) {
        const node = this.state.nodes[i];
        const type = REMOVE;

        if (!udids[node.udid] && node.type !== REMOVE) {
          nodes.push(composeNode(node, REMOVE, node.udid));
          udids[node.udid] = { type, index: index++ };
        }
      }

      this.setState({ nodes, udids });
    }

    removeNode(udid) {
      const { udids, nodes } = this.state;
      const { index } = udids[udid];

      delete udids[udid];     // mutating state for performance :/
      nodes.splice(index, 1); // mutating state for performance :/
    }

    render() {
      return (
        <g>
          {this.state.nodes.map((node) => {
            return (
              <SelectionItem
                key={node.udid}
                node={node}
                removeNode={() => this.removeNode(node.udid)}
                {...this.props}
              />
            );
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
