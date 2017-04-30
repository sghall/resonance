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
    const { props, state } = this;
    const childProps = Object.assign({}, props);
    delete childProps.className;

    return React.createElement(
      props.component,
      { className: props.className },
      state.nodes.map((node, index) => {
        const udid = props.keyAccessor(node);
        const type = state.udids[udid];

        return (
          <Node
            key={udid}

            udid={udid}
            type={type}
            node={node}
            index={index}

            start={props.start}

            enter={props.enter}
            update={props.update}
            leave={props.leave}

            render={props.render}

            removeUDID={this.removeUDID}
            lazyRemoveUDID={this.lazyRemoveUDID}
            {...childProps}
          />
        );
      }),
    );
  }
}
