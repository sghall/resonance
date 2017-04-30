// @flow weak

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dataUpdate from '../core/dataUpdate';
import Node from '../Node';
import { getRemoveUDID } from '../core/helpers';

export const propTypes = {
  data: PropTypes.array.isRequired,

  start: PropTypes.func.isRequired,

  enter: PropTypes.func,
  update: PropTypes.func,
  leave: PropTypes.func,

  render: PropTypes.func.isRequired,

  component: PropTypes.any,
  className: PropTypes.string,
  keyAccessor: PropTypes.func.isRequired,
};

export default class NodeGroup extends PureComponent {
  static propTypes = propTypes;

  static defaultProps = {
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
