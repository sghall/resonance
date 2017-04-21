// @flow weak

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dataUpdate from '../core/dataUpdate';
import withTransitions from '../core/withTransitions';
import defaultKeyAccessor from '../core/defaultKeyAccessor';

export const propTypes = {
  /**
   * An array of data objects.
   */
  data: PropTypes.array.isRequired,
  /**
   * The CSS class name of the container component.
   */
  className: PropTypes.string,
  /**
   * Function that returns a string key given a data object.
   */
  keyAccessor: PropTypes.func,
  /**
   * The container component nodes will be rendered into.
   */
  component: PropTypes.any,
  /**
   * The component that will be used to render each node.
   */
  nodeComponent: PropTypes.func.isRequired,
};

export default class NodeGroup extends PureComponent {
  static propTypes = propTypes;

  static defaultProps = {
    className: 'node-group',
    component: 'g',
    keyAccessor: defaultKeyAccessor,
  };

  constructor(props) {
    super(props);

    (this:any).removeUDID = this.removeUDID.bind(this);
    this.WrappedComponent = withTransitions(props.nodeComponent);
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

  WrappedComponent = null;
  removed = new Map();

  updateNodes(props) {
    this.setState((prevState) => {
      return dataUpdate(props, prevState, this.removed);
    });
  }

  removeUDID(udid) {
    this.removed.set(udid, true);
  }

  render() {
    const { props, WrappedComponent, state } = this;
    const childProps = Object.assign({}, props);

    Object.keys(propTypes).forEach((prop) => {
      delete childProps[prop];
    });

    return React.createElement(
      props.component,
      { className: props.className },
      state.nodes.map((node, index) => {
        const udid = props.keyAccessor(node);
        const type = state.udids[udid];

        return (
          <WrappedComponent
            key={udid}
            udid={udid}
            type={type}
            node={node}
            index={index}
            prevScale={state.prevScale}
            currScale={state.currScale}
            removeUDID={this.removeUDID}
            {...childProps}
          />
        );
      }),
    );
  }
}
