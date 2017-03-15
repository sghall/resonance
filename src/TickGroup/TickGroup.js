// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import dataUpdate from '../core/dataUpdate';
import withTransitions from '../core/withTransitions';
import defaultKeyAccessor from '../core/defaultKeyAccessor';

const propTypes = {
  /**
   * A continuous D3 scale with a ticks method.
   */
  scale: PropTypes.func.isRequired,
  /**
   * The CSS class name of the root g element.
   */
  className: PropTypes.string,
  /**
   * Function that returns the string key for each object.
   */
  keyAccessor: PropTypes.func,
  /**
   * The number of ticks to render (approximate)
   */
  tickCount: PropTypes.number,
  /**
   * A component that will be used for each tick.
   */
  tickComponent: PropTypes.func.isRequired,
};

export default class TickGroup extends PureComponent {
  static propTypes = propTypes;

  static defaultProps = {
    tickCount: 10,
    keyAccessor: defaultKeyAccessor,
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

  componentWillMount() {
    const { tickComponent: Tick } = this.props;
    this.WrappedComponent = withTransitions(Tick);
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
