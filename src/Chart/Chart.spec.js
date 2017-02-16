// @flow weak
/* eslint-env mocha */

import React from 'react';
import { assert } from 'chai';
import { createShallowWithContext } from 'test/utils';
import Chart from './Chart';

describe('<Chart />', () => {
  let shallow;

  before(() => {
    shallow = createShallowWithContext();
  });

  it('should render an svg element', () => {
    const wrapper = shallow(
      <Chart />,
    );
    assert.strictEqual(wrapper.is('svg'), true, 'should be an svg');
  });

  it('should spread props', () => {
    const wrapper = shallow(
      <Chart data-test="hello" />,
    );
    assert.strictEqual(wrapper.prop('data-test'), 'hello', 'should be spread on the Chart element');
  });

  it('should add user classes', () => {
    const wrapper = shallow(<Chart className="wu-tang" />);
    assert.strictEqual(wrapper.hasClass('wu-tang'), true, 'should have the wu-tang class');
  });
});
