// @flow weak
/* eslint-env mocha */

import React from 'react';
import { assert } from 'chai';
import { createShallowWithContext } from 'test/utils';
import NodeManager from './NodeManager';

describe('<NodeManager />', () => {
  let shallow;

  before(() => {
    shallow = createShallowWithContext();
  });

  it('should render an g element', () => {
    const wrapper = shallow(
      <NodeManager data={[]} nodeComponent={() => {}} />,
    );
    assert.strictEqual(wrapper.is('g'), true, 'should be a g element');
  });

  // it('should spread props to node components', () => {
  //   const wrapper = shallow(
  //     <NodeManager data-test="hello" />,
  //   );
  //   assert.strictEqual(wrapper.prop('data-test'), 'hello', 'should be spread on NodeManager');
  // });

  it('should add user classes', () => {
    const wrapper = shallow(<NodeManager data={[]} nodeComponent={() => {}} className="wu-tang" />);
    assert.strictEqual(wrapper.hasClass('wu-tang'), true, 'should have the wu-tang class');
  });
});

