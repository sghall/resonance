// @flow weak
/* eslint-env mocha */

import React from 'react';
import sinon from 'sinon';
import { assert } from 'chai';
import { shallow, mount } from 'enzyme';
import Tick from '../Tick';
import TickGroup from './TickGroup';

const scale = () => {};
scale.ticks = () => [1, 2, 3, 4, 5];

describe('<TickGroup />', () => {
  it('should render a g element', () => {
    const wrapper = shallow(
      <TickGroup scale={scale} />,
    );
    assert.strictEqual(wrapper.is('g'), true, 'should be a g element');
  });

  it('should render a tick for each tick in the scale', () => {
    const wrapper = mount(
      <TickGroup scale={scale} />,
    );

    assert.strictEqual(wrapper.find(Tick).length, scale.ticks().length, 'should be equal');
  });

  it('should add udid to removed map when calling lazyRemoveKey', () => {
    const wrapper = mount(
      <TickGroup scale={scale} />,
    );

    const instance = wrapper.instance();

    instance.lazyRemoveKey('key-1');
    assert.strictEqual(instance.state.removed['key-1'], true, 'key should exist in map');
  });

  it('should NOT pass other props to Tick components', () => {
    const wrapper = mount(
      <TickGroup test-prop="wu-tang" scale={scale} />,
    );

    const ticks = wrapper.find(Tick);

    let count = 0;

    ticks.forEach((n) => {
      if (n.prop('test-prop') === undefined) count++;
    });

    assert.strictEqual(count, scale.ticks().length, 'each Tick should have the test-prop');
  });

  it('should call updateTicks when given new scale prop', () => {
    const wrapper = mount(
      <TickGroup scale={scale} />,
    );

    const nextScale = () => {};
    nextScale.ticks = () => [1, 2, 3, 4, 5];

    const spy = sinon.spy(TickGroup.prototype, 'updateTicks');

    wrapper.setProps({ scale: nextScale });

    const callCount = TickGroup.prototype.updateTicks.callCount;
    spy.restore();

    assert.strictEqual(callCount, 1, 'should have been called once');
  });

  it('should not call updateTicks when passed same scale prop', () => {
    const wrapper = mount(
      <TickGroup scale={scale} />,
    );

    const spy = sinon.spy(TickGroup.prototype, 'updateTicks');

    wrapper.setProps({ scale });

    const callCount = TickGroup.prototype.updateTicks.callCount;
    spy.restore();

    assert.strictEqual(callCount, 0, 'should not have been called');
  });

  it('should add user classes', () => {
    const wrapper = shallow(<TickGroup scale={scale} className="wu-tang" />);
    assert.strictEqual(wrapper.hasClass('wu-tang'), true, 'should have the wu-tang class');
  });
});