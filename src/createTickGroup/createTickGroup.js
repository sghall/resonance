// @flow weak

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dataUpdate from '../core/dataUpdate';
import withTransitions from '../core/withTransitions';
import keyAccessor from '../core/defaultKeyAccessor';
import { getDisplayName } from '../core/helpers';

export const propTypes = {
  scale: PropTypes.func.isRequired,
  className: PropTypes.string,
  tickCount: PropTypes.number,
};

export default function createTickGroup(tickComponent, wrapperComponent) {
  return class TickGroup extends PureComponent {
    static propTypes = propTypes;

    static defaultProps = {
      className: 'tick-group',
      tickCount: 10,
    };

    static displayName = `TickGroup(${getDisplayName(tickComponent)})`

    constructor(props) {
      super(props);

      (this:any).removeUDID = this.removeUDID.bind(this);
      (this:any).lazyRemoveUDID = this.lazyRemoveUDID.bind(this);
      this.WrappedComponent = withTransitions(tickComponent);
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

    WrappedComponent = null;

    updateTicks(prev, next) {
      const { tickCount, scale } = next;
      const ticks = scale.ticks ? scale.ticks(tickCount) : [];

      this.setState((prevState) => {
        const mapped = ticks.map((tick) => ({ val: tick }));
        const update = dataUpdate(mapped, prevState, keyAccessor);
        return { ...update, prevScale: prev.scale, currScale: scale };
      });
    }

    removeUDID(udid) {
      this.setState((prevState, props) => {
        const index0 = prevState.nodes.findIndex((d) => keyAccessor(d) === udid);
        const index1 = props.data.findIndex((d) => keyAccessor(d) === udid);

        if (index0 >= 0 && index1 === -1) {
          const udids = Object.assign({}, prevState.udids);
          delete udids[udid];

          return {
            udids,
            nodes: [
              ...prevState.nodes.slice(0, index0),
              ...prevState.nodes.slice(index0 + 1),
            ],
          };
        }

        return prevState;
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
      delete childProps.scale;
      delete childProps.className;
      delete childProps.tickCount;

      return React.createElement(
        wrapperComponent,
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
              data={props.scale}
              index={index}
              prevScale={state.prevScale}
              currScale={state.currScale}
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
