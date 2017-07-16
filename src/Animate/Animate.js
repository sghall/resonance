// @flow weak
/* eslint max-len: "off" */

import React, { Component } from 'react';
import { transition, stop } from '../core/transition';

type Props = {
  /**
   * A data object.  The data prop is treated as immutable so the node will update if prev.data !== next.data.  If data === undefined the leave transition will run.
   */
  data?: {},
  /**
  * A function that returns the starting state.  The function is passed the data and must return an object.
  */
  start: (data: {}) => {} | Array<{}>,
  /**
   * A function that **returns an object or array of objects** describing how the state should transform on update.  The function is passed the data.
   */
  enter?: (data: {}) => {} | Array<{}>,
  /**
   * A function that **returns an object or array of objects** describing how the state should transform on update.  The function is passed the data.
   */
  update?: (data: {}) => {} | Array<{}>,
  /**
   * A function that **returns an object or array of objects** describing how the state should transform on leave.  The function receives no parameters.  You trigger a leave transition by sending data as null or undefined.
   */
  leave?: (data: {}) => {} | Array<{}>,
  /**
   * A function that renders the node. It should accept a single node as its only argument.  The node is an object with the data, state and a type of 'ENTER', 'UPDATE'.
   */
  children: (nodes: Array<{}>) => {},
};

class Animate extends Component {

  static defaultProps = {
    enter: () => {},
    update: () => {},
    leave: () => {},
  };

  state = this.props.start(this.props.data)

  componentDidMount() {
    const { data, enter } = this.props;
    transition.call(this, enter(data));
  }

  componentWillReceiveProps(next) {
    if (next.data === undefined || next.data !== this.props.data) {
      this.update(next);
    }
  }

  componentWillUnmount() {
    stop.call(this);
  }

  props: Props;

  update(props) {
    const { data, update, leave } = props;

    if (data === undefined) {
      transition.call(this, leave(data));
    } else {
      transition.call(this, update(data));
    }
  }

  render() {
    const renderedChildren = this.props.children(this.props.data, this.state);
    return renderedChildren && React.Children.only(renderedChildren);
  }
}

export default Animate;
