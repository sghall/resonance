// @flow weak

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dataUpdate from '../core/dataUpdate';
import withTransitions from '../core/withTransitions';
import keyAccessor from '../core/defaultKeyAccessor';

export const propTypes = {
  /**
   * The continuous D3 scale to use to render ticks.
   */
  scale: PropTypes.func.isRequired,
  /**
   * The CSS class name of the root g element.
   */
  className: PropTypes.string,
  /**
   * The number of ticks to render (approximate)
   */
  tickCount: PropTypes.number,
  /**
   * The wrapping component ticks will be rendered into.
   */
  component: PropTypes.any,
  /**
   * The component that will be used to render each tick.
   */
  tickComponent: PropTypes.func.isRequired,
};

export default class TickGroup extends PureComponent {
  static propTypes = propTypes;

  static defaultProps = {
    className: 'tick-group',
    component: 'g',
    tickCount: 10,
  };

  constructor(props) {
    super(props);

    (this:any).removeUDID = this.removeUDID.bind(this);
    this.WrappedComponent = withTransitions(props.tickComponent);
  }

  state = {
    nodes: [],
    udids: {},
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
  removed = new Map();

  updateTicks(prev, next) {
    const { tickCount, scale } = next;
    const ticks = scale.ticks ? scale.ticks(tickCount) : [];

    this.setState((prevState) => {
      const mapped = ticks.map((tick) => ({ val: tick }));
      const update = dataUpdate({ data: mapped, ...next }, prevState, this.removed);
      return { ...update, prevScale: prev.scale, currScale: scale };
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
        const udid = keyAccessor(node);
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
