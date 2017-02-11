// @flow weak
/* eslint-env mocha */

import React from 'react';
import { assert } from 'chai';
import { createShallowWithContext } from 'test/utils';
import SVG, { styleSheet } from './SVG';

describe('<SVG />', () => {
  let shallow;
  let classes;

  before(() => {
    shallow = createShallowWithContext();
    classes = shallow.context.styleManager.render(styleSheet);
  });

  it('should render a div', () => {
    const wrapper = shallow(
      <SVG>Hello World</SVG>,
    );
    assert.strictEqual(wrapper.is('div'), true, 'should be a div');
  });

  it('should render with the paper class, default depth class, and rounded', () => {
    const wrapper = shallow(<SVG>Hello World</SVG>);
    assert.strictEqual(wrapper.hasClass(classes.svg), true, 'should have the svg class');
    assert.strictEqual(wrapper.hasClass(classes.rounded), true, 'should be rounded by default');
  });

  it('should disable the rounded class', () => {
    const wrapper = shallow(<SVG rounded={false}>Hello World</SVG>);
    assert.strictEqual(wrapper.hasClass(classes.rounded), false, 'should not be rounded');
  });

  it('should set the zDepth shadow class', () => {
    const wrapper = shallow(<SVG zDepth={16}>Hello World</SVG>);
    assert.strictEqual(wrapper.hasClass(classes.dp16), true, 'should have the dp16 shadow class');
    wrapper.setProps({ zDepth: 24 });
    assert.strictEqual(wrapper.hasClass(classes.dp24), true, 'should have the dp24 shadow class');
    wrapper.setProps({ zDepth: 2 });
    assert.strictEqual(wrapper.hasClass(classes.dp2), true, 'should have the dp2 shadow class');
  });
});
