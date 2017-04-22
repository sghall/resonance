// @flow weak
/* eslint-env mocha, class-methods-use-this: "off" */
/* eslint class-methods-use-this: "off" */

import React, { Component } from 'react';
import { assert } from 'chai';
import sinon from 'sinon';
import createMount from 'test/utils/createMount';
import { APPEAR, UPDATE } from '../types';
import withTransitions from './withTransitions';

const props = {
  type: APPEAR,
  udid: 'unique_id',
  node: { x: 10, y: 20 },
  index: 0,
  removeUDID: () => {},
  lazyRemoveUDID: () => {},
};

class Node extends Component {

  line = null // ref set in render
  rect = null // ref set in render
  path = null // ref set in render

  onAppear() {
    return {
      line: {
        x1: [5, 200],
        y1: [5, 400],
      },
      rect: {
        x: [5, 1000],
        y: [5, 2000],
      },
    };
  }

  onUpdate() {
    return {
      line: {
        x1: [2000],
        y1: [4000],
      },
      rect: {
        x: [100],
        y: [200],
      },
    };
  }

  render() {
    return (
      <g>
        <line
          ref={(d) => { this.line = d; }}
          x1={0} y1={0}
        />
        <rect
          ref={(d) => { this.rect = d; }}
          x={0} y={0}
        />
        <path
          ref={(d) => { this.path = d; }}
          x={0} y={0}
        />
      </g>
    );
  }
}

describe('withTransitions', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should contain a Node instance', () => {
    const NodeWithTransitions = withTransitions(Node);
    const wrapper = mount(<NodeWithTransitions {...props} />);

    assert.strictEqual(wrapper.find(Node).length, 1);
  });

  it('should call invokeMethodIfExists after mounting', () => {
    const NodeWithTransitions = withTransitions(Node);
    sinon.spy(NodeWithTransitions.prototype, 'invokeMethodIfExists');

    mount(<NodeWithTransitions {...props} />);

    const called = NodeWithTransitions.prototype.invokeMethodIfExists.calledOnce;

    assert.strictEqual(called, true, 'should have been called once');
  });

  it('should call the onAppear method of the wrapped instance', () => {
    const NodeWithTransitions = withTransitions(Node);
    sinon.spy(Node.prototype, 'onAppear');

    mount(<NodeWithTransitions {...props} />);

    const called = Node.prototype.onAppear.calledOnce;

    assert.strictEqual(called, true, 'should have been called once');
  });

  it('should NOT call the onUpdate method after mounting', () => {
    const NodeWithTransitions = withTransitions(Node);
    const spy = sinon.spy(Node.prototype, 'onUpdate');

    mount(<NodeWithTransitions {...props} />);

    const callCount = Node.prototype.onUpdate.callCount;
    spy.restore();

    assert.strictEqual(callCount, 0, 'should NOT have been called');
  });

  it('should call the onUpdate method when type changes to UPDATE', () => {
    const NodeWithTransitions = withTransitions(Node);
    const spy = sinon.spy(Node.prototype, 'onUpdate');

    const wrapper = mount(<NodeWithTransitions {...props} />);
    wrapper.setProps({ ...props, type: UPDATE });

    const callCount = Node.prototype.onUpdate.callCount;
    spy.restore();

    assert.strictEqual(callCount, 1, 'should have been called once');
  });

  it('should call the Node component with the correct props', () => {
    const NodeWithTransitions = withTransitions(Node);
    const wrapper = mount(<NodeWithTransitions {...props} />);
    const nodesProps = wrapper.find(Node).get(0).props;

    assert.strictEqual(Object.keys(nodesProps).length, 5, 'should have 5 props');
    assert.strictEqual(nodesProps.type, APPEAR, 'should have type prop');
    assert.strictEqual(nodesProps.data, props.node, 'should have data prop');
    assert.strictEqual(nodesProps.index, props.index, 'should have index prop');
    assert.strictEqual(typeof nodesProps.remove, 'function', 'should have remove prop');
    assert.strictEqual(typeof nodesProps.lazyRemove, 'function', 'should have lazyRemove prop');
  });
});
