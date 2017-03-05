// @flow weak
/* eslint-env mocha */

import React from 'react';
import { assert } from 'chai';
import { shallow } from 'enzyme';
import TickManager from './TickManager';

const noop = () => {};

describe('<TickManager />', () => {
  it('should render an g element', () => {
    const wrapper = shallow(
      <TickManager scale={noop} tickComponent={noop} />,
    );
    assert.strictEqual(wrapper.is('g'), true, 'should be a g element');
  });

  // it('should spread props to tick components', () => {
  //   const wrapper = shallow(
  //     <TickManager data-test="hello" />,
  //   );
  //   assert.strictEqual(wrapper.prop('data-test'), 'hello', 'should be spread on TickManager');
  // });

  it('should add user classes', () => {
    const wrapper = shallow(<TickManager scale={noop} tickComponent={noop} className="wu-tang" />);
    assert.strictEqual(wrapper.hasClass('wu-tang'), true, 'should have the wu-tang class');
  });
});

