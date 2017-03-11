// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import defaultKeyAccessor from '../core/defaultKeyAccessor';
import defaultComposeNode from '../core/defaultComposeNode';
import dataUpdate from '../core/dataUpdate';

const propTypes = {
  /**
   * The CSS class name of the root element.
   */
  scale: PropTypes.func.isRequired,
  /**
   * The CSS class name of the root element.
   */
  className: PropTypes.string,
  /**
   * The CSS class name of the root element.
   */
  keyAccessor: PropTypes.func,
  /**
   * Shadow depth, corresponds to `dp` in the spec.
   */
  composeNode: PropTypes.func,
  /**
   * Set to false to disable rounded corners.
   */
  tickCount: PropTypes.number,
  /**
   * Set to false to disable rounded corners.
   */
  tickComponent: PropTypes.func.isRequired,
};

export default class TickGroup extends PureComponent {
  static propTypes = propTypes;

  static defaultProps = {
    tickCount: 10,
    keyAccessor: defaultKeyAccessor,
    composeNode: defaultComposeNode,
  };

  constructor(props) {
    super(props);

    (this:any).removeUDID = this.removeUDID.bind(this);
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
    const { props: { keyAccessor, className, tickComponent: Tick }, state } = this;

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
            <Tick
              key={udid}
              udid={udid}
              type={type}
              node={node}
              prevScale={state.prevScale}
              currScale={state.currScale}
              removeUDID={this.removeUDID}
              {...props}
            />
          );
        })}
      </g>
    );
  }
}
