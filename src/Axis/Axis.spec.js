// @flow weak
/* eslint-env mocha */

import React from 'react';
import { assert } from 'chai';
import { createShallowWithContext } from 'test/utils';
import Axis from './Axis';

describe('<Axis />', () => {
  let shallow;

  before(() => {
    shallow = createShallowWithContext();
  });

  it('should render a g element', () => {
    const wrapper = shallow(
      <Axis><rect /></Axis>,
    );
    assert.strictEqual(wrapper.is('g'), true, 'should be a g element');
  });
});
