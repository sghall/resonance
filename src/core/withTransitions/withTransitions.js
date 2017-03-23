// @flow weak
import React, { PureComponent, PropTypes } from 'react';
import transition from './transition';
import stop from './stop';
import { getDisplayName } from './helpers';
import { APPEAR, UPDATE, REMOVE } from '../types';

export const propTypes = {
  type: PropTypes.string.isRequired,
  udid: PropTypes.string.isRequired,
  node: PropTypes.object.isRequired,
  removeUDID: PropTypes.func.isRequired,
};

function withTransitions(Component) {
  class TransitionComponent extends PureComponent {
    static propTypes = propTypes;

    static displayName = `withTransitions(${getDisplayName(Component)})`

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
        const prevProps = Object.assign({}, prev, {
          data: prev.node,
        });

        Object.keys(propTypes).forEach((p) => {
          delete prevProps[p];
        });

        switch (props.type) {
          case APPEAR:
            this.invokeMethodIfExists('onAppear', prevProps);
            break;
          case UPDATE:
            this.invokeMethodIfExists('onUpdate', prevProps);
            break;
          case REMOVE:
            this.invokeMethodIfExists('onRemove', prevProps);
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

    invokeMethodIfExists(method, prevProps) {
      const { node } = this;
      if (node && node[method]) {
        transition.call(node, node[method](prevProps || node.props));
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
          data={this.props.node}
          removeNode={this.removeNode}
          {...props}
        />
      );
    }
  }

  return TransitionComponent;
}

export default withTransitions;
