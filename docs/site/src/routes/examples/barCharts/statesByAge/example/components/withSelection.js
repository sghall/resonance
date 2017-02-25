// @flow weak

import React, { Component, PropTypes } from 'react';

export const APPEAR = 'APPEAR';
export const UPDATE = 'UPDATE';
export const REMOVE = 'REMOVE';
export const REVIVE = 'REVIVE';

export function withSelection(WrappedComponent, getStringKey) {
  class SelectionComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        nodes: {},
      };

      this.registry = {};

      this.unlistNode = this.unlistNode.bind(this);
    }

    componentWillReceiveProps(next) {
      if (this.props.data !== next.data) {
        this.updateNodes(this.props);
      }
    }

    unlistNode(udid) {
      this.exited[udid] = true;
    }

    updateNodes({ data, typeKey, udidKey }) {
      const nodes = {};

      for (let i = 0, len = data.length; i < len; i++) {
        const udid = getStringKey(data[i]);

        nodes[udid] = { ...data[i], [udidKey]: udid };

        if (this.state.nodes[udid] && !this.removed[udid]) {
          nodes[udid][typeKey] = UPDATE;
        } else {
          nodes[udid][typeKey] = APPEAR;
        }
      }

      const keys = Object.keys(this.state.nodes);

      for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i];

        if (!nodes[key] && !this.exited[key]) {
          const node = this.state.nodes[key];
          nodes[key] = { ...node, [typeKey]: REMOVE };
        }
      }

      this.exited = {};

      this.setState({ nodes });
    }


    render() {
      return (
        <WrappedComponent
          onExit={this.handleExit}
          nodes={this.state.nodes} {...this.props}
        />
      );
    }
  }

  SelectionComponent.propTypes = {
    data: PropTypes.array,
    typeKey: PropTypes.string,
    udidKey: PropTypes.string,
  };

  SelectionComponent.defaultProps = {
    typeKey: 'type',
    udidKey: 'udid',
  };

  return SelectionComponent;
}
