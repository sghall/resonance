// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import dataUpdate from '../core/dataUpdate';
import withTransitions from '../core/withTransitions';
import defaultKeyAccessor from '../core/defaultKeyAccessor';

const propTypes = {
  /**
   * An array of data objects.
   */
  data: PropTypes.array.isRequired,
  /**
   * The CSS class name of the root g element.
   */
  className: PropTypes.string,
  /**
   * The function that returns a string key given a data object.
   */
  keyAccessor: PropTypes.func,
  /**
   * The component that will be used to render each node.
   */
  nodeComponent: PropTypes.func.isRequired,
};

export default class NodeGroup extends PureComponent {
  static propTypes = propTypes;

  static defaultProps = {
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
    const { props: { keyAccessor, className }, WrappedComponent, state } = this;

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
            <WrappedComponent
              key={udid}
              udid={udid}
              type={type}
              node={node}
              removeUDID={this.removeUDID}
              {...props}
            />
          );
        })}
      </g>
    );
  }
}
