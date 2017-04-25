// @flow weak
/* eslint-env mocha */

import React from 'react';
import sinon from 'sinon';
import { assert } from 'chai';
import { shallow, mount } from 'enzyme';
import createNodeGroup from './createNodeGroup';

const Node = () => <line />;
const data = [1, 2, 3, 4, 5].map((d) => ({ val: d }));

const NodeGroup = createNodeGroup(Node, 'g', (d) => JSON.stringify(d));

describe('<NodeGroup />', () => {
  it('should render a g element', () => {
    const wrapper = shallow(
      <NodeGroup data={data} />,
    );
    assert.strictEqual(wrapper.is('g'), true, 'should be a g element');
  });

  it('should render a node for each data item', () => {
    const wrapper = mount(
      <NodeGroup data={data} />,
    );

    assert.strictEqual(wrapper.find(Node).length, data.length, 'should be equal');
  });

  it('should add udid to removed map when calling lazyRemoveUDID', () => {
    const wrapper = mount(
      <NodeGroup data={data} />,
    );

    const instance = wrapper.instance();

    instance.lazyRemoveUDID('key-1');
    assert.strictEqual(instance.state.removed['key-1'], true, 'key should exist in map');
  });

  it('should pass props to Node components', () => {
    const wrapper = mount(
      <NodeGroup test-prop="wu-tang" data={data} />,
    );

    const nodes = wrapper.find(Node);

    let count = 0;

    nodes.forEach((n) => {
      if (n.prop('test-prop') === 'wu-tang') count++;
    });

    assert.strictEqual(count, data.length, 'each Node should have the test-prop');
  });

  it('should call setState when given new data prop', () => {
    const wrapper = mount(
      <NodeGroup data={data} />,
    );

    const spy = sinon.spy(NodeGroup.prototype, 'setState');

    wrapper.setProps({ data: [{ val: 1 }, { val: 2 }] });

    const callCount = NodeGroup.prototype.setState.callCount;
    spy.restore();

    assert.strictEqual(callCount, 1, 'should have been called once');
  });

  it('should not call setState when passed same data prop', () => {
    const wrapper = mount(
      <NodeGroup data={data} />,
    );

    const spy = sinon.spy(NodeGroup.prototype, 'setState');

    wrapper.setProps({ data });

    const callCount = NodeGroup.prototype.setState.callCount;
    spy.restore();

    assert.strictEqual(callCount, 0, 'should not have been called');
  });

  it('should add user classes', () => {
    const wrapper = shallow(<NodeGroup data={data} className="wu-tang" />);
    assert.strictEqual(wrapper.hasClass('wu-tang'), true, 'should have the wu-tang class');
  });
});
