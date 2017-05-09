// @flow weak
/* eslint-env mocha */

import React from 'react';
import sinon from 'sinon';
import { assert } from 'chai';
import { shallow, mount } from 'enzyme';
import Node from '../Node';
import NodeGroup from './NodeGroup';

const data = [1, 2, 3, 4, 5].map((d) => ({ val: d }));

describe('<NodeGroup />', () => {
  it('should render a g element', () => {
    const wrapper = shallow(
      <NodeGroup
        data={data}
        keyAccessor={(d) => d.val}
      />,
    );
    assert.strictEqual(wrapper.is('g'), true, 'should be a g element');
  });

  it('should render a node for each data item', () => {
    const wrapper = shallow(
      <NodeGroup
        data={data}
        keyAccessor={(d) => d.val}
      />,
    );
    assert.strictEqual(wrapper.find(Node).length, data.length, 'should be equal');
  });

  it('should add udid to removed map when calling lazyRemoveKey', () => {
    const wrapper = shallow(
      <NodeGroup
        data={data}
        keyAccessor={(d) => d.val}
      />,
    );

    const instance = wrapper.instance();

    instance.lazyRemoveKey('key-1');
    assert.strictEqual(instance.state.removed['key-1'], true, 'key should exist in map');
  });

  it('should NOT pass other props to Node components', () => {
    const wrapper = shallow(
      <NodeGroup
        data={data}
        keyAccessor={(d) => d.val}
        test-prop="wu-tang"
      />,
    );

    const nodes = wrapper.find(Node);

    let count = 0;

    nodes.forEach((n) => {
      if (n.prop('test-prop') === undefined) count++;
    });

    assert.strictEqual(count, data.length, 'should be equal');
  });

  it('should call setState when given new data prop', () => {
    const wrapper = mount(
      <NodeGroup
        data={data}
        keyAccessor={(d) => d.val}
      />,
    );

    const spy = sinon.spy(NodeGroup.prototype, 'setState');

    wrapper.setProps({ data: [{ val: 1 }, { val: 2 }] });

    const callCount = NodeGroup.prototype.setState.callCount;
    spy.restore();

    assert.strictEqual(callCount, 1, 'should have been called once');
  });

  it('should not call setState when passed same data prop', () => {
    const wrapper = mount(
      <NodeGroup
        data={data}
        keyAccessor={(d) => d.val}
      />,
    );

    const spy = sinon.spy(NodeGroup.prototype, 'setState');

    wrapper.setProps({ data });

    const callCount = NodeGroup.prototype.setState.callCount;
    spy.restore();

    assert.strictEqual(callCount, 0, 'should not have been called');
  });

  it('should add user classes', () => {
    const wrapper = shallow(<NodeGroup data={data} keyAccessor={(d) => d.val} className="wu-tang" />);
    assert.strictEqual(wrapper.hasClass('wu-tang'), true, 'should have the wu-tang class');
  });
});
