// @flow weak
import React, { PureComponent, PropTypes } from 'react';
import transition from './transition';
import stop from './stop';
import { APPEAR, UPDATE, REMOVE } from '../core/types';

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

const propTypes = {
  type: PropTypes.string.isRequired,
  udid: PropTypes.string.isRequired,
  removeUDID: PropTypes.func.isRequired,
};

function withTransitions(Component) {
  class Transition extends PureComponent {
    static propTypes = propTypes;

    static displayName = `Transition(${getDisplayName(Component)})`

    constructor(props) {
      super(props);

      (this:any).getNodeRef = this.getNodeRef.bind(this);
      (this:any).removeNode = this.removeNode.bind(this);
    }

    componentDidMount() {
      this.invokeMethodIfExists('onAppear');
    }

    componentDidUpdate(prev) {
      const { props } = this;

      if (
        prev.node !== props.node ||
        prev.type !== props.type
      ) {
        switch (props.type) {
          case APPEAR:
            this.invokeMethodIfExists('onAppear');
            break;
          case UPDATE:
            this.invokeMethodIfExists('onUpdate');
            break;
          case REMOVE:
            this.invokeMethodIfExists('onRemove');
            break;
          default:
            break;
        }
      }
    }

    componentWillUnmount() {
      stop.call(this.node);
    }

    node = null; // ref for wrapped component

    invokeMethodIfExists(method) {
      if (this.node && this.node[method]) {
        transition.call(this.node, this.node[method]());
      }
    }

    removeNode() {
      const { removeUDID, udid } = this.props;
      removeUDID(udid);
    }

    getNodeRef(d) {
      this.node = d;
    }

    render() {
      const props = Object.assign({}, this.props);

      Object.keys(propTypes).forEach((p) => {
        delete props[p];
      });

      return (
        <Component
          ref={this.getNodeRef}
          type={this.props.type}
          removeNode={this.removeNode}
          {...props}
        />
      );
    }
  }

  return Transition;
}

export default withTransitions;
