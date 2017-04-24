// @flow weak

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dataUpdate from '../core/dataUpdate';
import withTransitions from '../core/withTransitions';

export const propTypes = {
  /**
   * An array of data objects.
   */
  data: PropTypes.array.isRequired,
  /**
   * The CSS class name of the container component.
   */
  className: PropTypes.string,
};

export default function createNodeGroup(nodeComponent, component, keyAccessor) {
  return class NodeGroup extends PureComponent {
    static propTypes = propTypes;

    static defaultProps = {
      className: 'node-group',
    };

    constructor(props) {
      super(props);

      (this:any).removeUDID = this.removeUDID.bind(this);
      (this:any).lazyRemoveUDID = this.lazyRemoveUDID.bind(this);
      this.WrappedComponent = withTransitions(nodeComponent);
    }

    componentWillReceiveProps(next) {
      if (this.props.data !== next.data) {
        this.setState((prevState) => {
          return dataUpdate(next.data, prevState, keyAccessor);
        });
      }
    }

    WrappedComponent = null;

    state = dataUpdate(this.props.data, {}, keyAccessor);

    removeUDID(udid) {
      this.setState((prevState, props) => {
        const nextState = Object.assign({}, prevState, {
          removed: Object.assign({}, prevState.removed, { [udid]: true }),
        });

        return dataUpdate(props.data, nextState, keyAccessor);
      });
    }

    lazyRemoveUDID(udid) {
      this.setState((prevState) => ({
        removed: Object.assign({}, prevState.removed, { [udid]: true }),
      }));
    }

    render() {
      const { props, WrappedComponent, state } = this;
      const childProps = Object.assign({}, props);

      Object.keys(propTypes).forEach((prop) => {
        delete childProps[prop];
      });

      return React.createElement(
        component,
        { className: props.className },
        state.nodes.map((node, index) => {
          const udid = keyAccessor(node);
          const type = state.udids[udid];

          return (
            <WrappedComponent
              key={udid}
              udid={udid}
              type={type}
              node={node}
              index={index}
              removeUDID={this.removeUDID}
              lazyRemoveUDID={this.lazyRemoveUDID}
              {...childProps}
            />
          );
        }),
      );
    }
  };
}
