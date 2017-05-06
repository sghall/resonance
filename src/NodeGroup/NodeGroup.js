// @flow weak
/* eslint max-len: "off" */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dataUpdate from '../core/dataUpdate';
import Node from '../Node';
import { getRemoveUDID } from '../core/helpers';

export const propTypes = {
  /**
   * An array of data objects.
   */
  data: PropTypes.array.isRequired,
  /**
   * A function that returns the starting state.  The function is passed the data and index.
   */
  start: PropTypes.func.isRequired,
  /**
   * A function that **returns an object or array of objects** describing how the state should transform on enter.  The function is passed the data and index.
   */
  enter: PropTypes.func,
  /**
   * A function that **returns an object or array of objects** describing how the state should transform on update.  The function is passed the data and index.
   */
  update: PropTypes.func,
  /**
   * A function that **returns an object or array of objects** describing how the state should transform on leave.  The function is passed the data, index and remove function to be called when you want to remove the node.
   */
  leave: PropTypes.func,
  /**
   * Function that is used to render the current state of each node.  Passed the data, state, index, and type (ENTER, UPDATE or LEAVE).
   */
  render: PropTypes.func.isRequired,
  /**
   * The wrapper component for the nodes. Can be a custom component or 'div', 'span', etc.
   */
  component: PropTypes.any,
  /**
   * String class name for the wrapper component.
   */
  className: PropTypes.string,
  /**
   * Function that returns a string key given a data object.  Used to track which nodes are entering, updating and leaving.
   */
  keyAccessor: PropTypes.func.isRequired,
};

export default class NodeGroup extends PureComponent {
  static propTypes = propTypes;

  static defaultProps = {
    enter: () => {},
    update: () => {},
    leave: () => {},
    component: 'g',
    className: 'node-group',
  };

  constructor(props) {
    super(props);

    (this:any).lazyRemoveUDID = this.lazyRemoveUDID.bind(this);
  }

  state = dataUpdate(this.props.data, {}, this.props.keyAccessor);

  componentWillReceiveProps(next) {
    if (this.props.data !== next.data) {
      this.setState((prevState) => {
        return dataUpdate(next.data, prevState, next.keyAccessor);
      });
    }
  }

  removeUDID = getRemoveUDID.call(this, this.props.keyAccessor);

  lazyRemoveUDID(udid) {
    this.setState((prevState) => ({
      removed: Object.assign({}, prevState.removed, { [udid]: true }),
    }));
  }

  render() {
    const { props: {
      data,
      start,
      enter,
      update,
      leave,
      render,
      component,
      className,
      keyAccessor,
    }, state } = this;

    return React.createElement(
      component,
      { className },
      state.nodes.map((node, index) => {
        const udid = keyAccessor(node);
        const type = state.udids[udid];

        return (
          <Node
            key={udid}

            data={data}

            udid={udid}
            type={type}
            node={node}
            index={index}

            start={start}

            enter={enter}
            update={update}
            leave={leave}

            render={render}

            removeUDID={this.removeUDID}
            lazyRemoveUDID={this.lazyRemoveUDID}
          />
        );
      }),
    );
  }
}
