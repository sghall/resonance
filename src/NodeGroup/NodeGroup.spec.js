// @flow weak
/* eslint-env mocha */

import React from 'react';
import sinon from 'sinon';
import { assert } from 'chai';
import { shallow, mount } from 'enzyme';
import NodeGroup from './NodeGroup';

const Node = () => <line />;
const data = [1, 2, 3, 4, 5];

describe('<NodeGroup />', () => {
  it('should render a g element', () => {
    const wrapper = shallow(
      <NodeGroup data={data} nodeComponent={Node} />,
    );
    assert.strictEqual(wrapper.is('g'), true, 'should be a g element');
  });

  it('should render a node for each data item', () => {
    const wrapper = mount(
      <NodeGroup data={data} nodeComponent={Node} />,
    );

    assert.strictEqual(wrapper.find(Node).length, data.length, 'should be equal');
  });

  it('should add udid to removed map when calling removeNode', () => {
    const wrapper = mount(
      <NodeGroup data={data} nodeComponent={Node} />,
    );

    const instance = wrapper.instance();

    instance.removeNode('key-1');
    assert.strictEqual(instance.removed.has('key-1'), true, 'key should exist in map');
  });

  it('should pass props to Node components', () => {
    const wrapper = mount(
      <NodeGroup test-prop="wu-tang" data={data} nodeComponent={Node} />,
    );

    const nodes = wrapper.find(Node);

    let count = 0;

    nodes.forEach((n) => {
      if (n.prop('test-prop') === 'wu-tang') count++;
    });

    assert.strictEqual(count, data.length, 'each Node should have the test-prop');
  });

  it('should call updateNodes when given new data prop', () => {
    const wrapper = mount(
      <NodeGroup data={data} nodeComponent={Node} />,
    );

    const spy = sinon.spy(NodeGroup.prototype, 'updateNodes');

    wrapper.setProps({ data: [1, 2] });

    const callCount = NodeGroup.prototype.updateNodes.callCount;
    spy.restore();

    assert.strictEqual(callCount, 1, 'should have been called once');
  });

  it('should not call updateNodes when passed same data prop', () => {
    const wrapper = mount(
      <NodeGroup data={data} nodeComponent={Node} />,
    );

    const spy = sinon.spy(NodeGroup.prototype, 'updateNodes');

    wrapper.setProps({ data });

    const callCount = NodeGroup.prototype.updateNodes.callCount;
    spy.restore();

    assert.strictEqual(callCount, 0, 'should not have been called');
  });

  it('should add user classes', () => {
    const wrapper = shallow(<NodeGroup data={data} nodeComponent={Node} className="wu-tang" />);
    assert.strictEqual(wrapper.hasClass('wu-tang'), true, 'should have the wu-tang class');
  });
});

