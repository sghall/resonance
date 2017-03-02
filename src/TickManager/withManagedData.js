// @flow weak

import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';

export const APPEAR = 'APPEAR';
export const UPDATE = 'UPDATE';
export const REMOVE = 'REMOVE';
export const REVIVE = 'REVIVE';

const keyToString = (d) => `key-${d}`;

export const defaultKeyAccessor = (d, i) => {
  if (typeof d === 'number' || typeof d === 'string') {
    return keyToString(d);
  } else if (d.id) {
    return keyToString(d.id);
  } else if (d.udid) {
    return keyToString(d.udid);
  }

  return keyToString(i);
};

export const defaultComposeNode = (data, type, udid) => {
  if (typeof data === 'number' || typeof data === 'string') {
    return { data, type, udid };
  }

  return { ...data, type, udid };
};

export default function withManagedData(ManagedItem) {
  class DataManager extends Component {
    static propTypes = {
      data: PropTypes.array,
      keyAccessor: PropTypes.func,
      composeNode: PropTypes.func,
    };

    static defaultProps = {
      keyAccessor: defaultKeyAccessor,
      composeNode: defaultComposeNode,
    };

    constructor(props) {
      super(props);

      this.state = { nodes: new Immutable.OrderedMap() };
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

    updateNodes({ data, keyAccessor, composeNode }) {
      const nodes = new Immutable.OrderedMap().withMutations((n) => {
        for (let i = 0, len = data.length; i < len; i++) {
          const udid = keyAccessor(data[i], i, data);
          const node = this.state.nodes.get(udid);

          let type = APPEAR;

          if (node) {
            if (node.type === REMOVE) {
              type = REVIVE;
            } else {
              type = UPDATE;
            }
          }

          n.set(udid, composeNode(data[i], type, udid));
        }

        this.state.nodes.toSeq().forEach((node) => {
          if (!n.has(node.udid) && node.type !== REMOVE) {
            n.set(node.udid, composeNode(node, REMOVE, node.udid));
          }
        });
      });

      this.setState({ nodes });
    }

    removeNode(udid) {
      const { nodes } = this.state;
      this.setState({ nodes: nodes.delete(udid) });
    }

    render() {
      return (
        <g>
          {this.state.nodes.toArray().map((node) => {
            return (
              <ManagedItem
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

  return DataManager;
}
