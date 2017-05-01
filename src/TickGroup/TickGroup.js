// @flow weak

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dataUpdate from '../core/dataUpdate';
import Node from '../Node';
import { getRemoveUDID } from '../core/helpers';

const keyAccessor = (d) => `tick-${d.val}`;

export const propTypes = {
  scale: PropTypes.func.isRequired,

  start: PropTypes.func.isRequired,

  enter: PropTypes.func,
  update: PropTypes.func,
  leave: PropTypes.func,

  render: PropTypes.func.isRequired,

  component: PropTypes.any,
  className: PropTypes.string,
  keyAccessor: PropTypes.func.isRequired,
};

export default class TickGroup extends PureComponent {
  static propTypes = propTypes;

  static defaultProps = {
    component: 'g',
    className: 'tick-group',
  };

  constructor(props) {
    super(props);

    (this:any).lazyRemoveUDID = this.lazyRemoveUDID.bind(this);
  }

  state = {
    nodes: [],
    udids: {},
    removed: {},
    prevScale: () => {},
    currScale: () => {},
  }

  componentDidMount() {
    this.updateTicks(this.props, this.props);
  }

  componentWillReceiveProps(next) {
    if (this.props.scale !== next.scale) {
      this.updateTicks(this.props, next);
    }
  }

  updateTicks(prev, next) {
    const { tickCount, scale } = next;
    const ticks = scale.ticks ? scale.ticks(tickCount) : [];

    this.setState((prevState) => {
      const mapped = ticks.map((tick) => ({ val: tick }));
      const update = dataUpdate(mapped, prevState, keyAccessor);
      return { ...update, prevScale: prev.scale, currScale: scale };
    });
  }

  removeUDID = getRemoveUDID.call(this, keyAccessor);

  lazyRemoveUDID(udid) {
    this.setState((prevState) => ({
      removed: Object.assign({}, prevState.removed, { [udid]: true }),
    }));
  }

  render() {
    const { props: {
      scale,
      start,
      enter,
      update,
      leave,
      render,
      component,
      className,
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

            data={scale}

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
