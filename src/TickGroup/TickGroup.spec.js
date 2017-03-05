// @flow weak
/* eslint-env mocha */

import React from 'react';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import TickGroup from './TickGroup';

const noop = () => {};

describe('<TickGroup />', () => {
  it('should render an g element', () => {
    const wrapper = shallow(
      <TickGroup scale={noop} tickComponent={noop} />,
    );
    assert.strictEqual(wrapper.is('g'), true, 'should be a g element');
  });

  // it('should spread props to tick components', () => {
  //   const wrapper = shallow(
  //     <TickGroup data-test="hello" />,
  //   );
  //   assert.strictEqual(wrapper.prop('data-test'), 'hello', 'should be spread on TickGroup');
  // });

  it('should add user classes', () => {
    const wrapper = shallow(<TickGroup scale={noop} tickComponent={noop} className="wu-tang" />);
    assert.strictEqual(wrapper.hasClass('wu-tang'), true, 'should have the wu-tang class');
  });
});

