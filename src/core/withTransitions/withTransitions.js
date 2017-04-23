// @flow weak
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import transition from './transition';
import stop from './stop';
import { getDisplayName } from './helpers';
import { ENTER, UPDATE, EXIT } from '../types';

export const propTypes = {
  type: PropTypes.string.isRequired,
  udid: PropTypes.string.isRequired,
  node: PropTypes.object.isRequired,
  removeUDID: PropTypes.func.isRequired,
  lazyRemoveUDID: PropTypes.func.isRequired,
};

function withTransitions(Component) {
  class TransitionComponent extends PureComponent {
    static propTypes = propTypes;

    static displayName = `withTransitions(${getDisplayName(Component)})`

    constructor(props) {
      super(props);

      (this:any).getNodeRef = this.getNodeRef.bind(this);
      (this:any).remove = this.remove.bind(this);
      (this:any).lazyRemove = this.lazyRemove.bind(this);
    }

    componentDidMount() {
      this.invokeMethodIfExists('onEnter');
    }

    componentDidUpdate(prev) {
      const { props } = this;

      if (
        prev.node !== props.node ||
        prev.type !== props.type
      ) {
        switch (props.type) {
          case ENTER:
            this.invokeMethodIfExists('onEnter');
            break;
          case UPDATE:
            this.invokeMethodIfExists('onUpdate');
            break;
          case EXIT:
            this.invokeMethodIfExists('onExit');
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
      const { node } = this;
      if (node && node[method]) {
        transition.call(node, node[method]());
      }
    }

    remove() {
      const { removeUDID, udid } = this.props;
      removeUDID(udid);
    }

    lazyRemove() {
      const { lazyRemoveUDID, udid } = this.props;
      lazyRemoveUDID(udid);
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
          remove={this.remove}
          lazyRemove={this.lazyRemove}
          {...props}
        />
      );
    }
  }

  return TransitionComponent;
}

export default withTransitions;
