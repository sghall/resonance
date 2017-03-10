// @flow weak
/* eslint-env mocha */

import React from 'react';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import Surface from './Surface';

describe('<Surface />', () => {
  it('should render an div element', () => {
    const wrapper = shallow(
      <Surface />,
    );
    assert.strictEqual(wrapper.is('div'), true, 'should be an div');
  });

  it('should spread props', () => {
    const wrapper = shallow(
      <Surface data-test="hello" />,
    );
    assert.strictEqual(wrapper.prop('data-test'), 'hello', 'should be spread on Surface element');
  });

  it('should add user classes', () => {
    const wrapper = shallow(<Surface className="wu-tang" />);
    assert.strictEqual(wrapper.hasClass('wu-tang'), true, 'should have the wu-tang class');
  });
});
