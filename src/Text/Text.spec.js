// @flow weak
/* eslint-env mocha */

import React from 'react';
import { assert } from 'chai';
import { createShallowWithContext } from 'test/utils';
import Text, { styleSheet, textTypes } from './Text';

describe('<Text />', () => {
  let shallow;
  let classes;

  before(() => {
    shallow = createShallowWithContext();
    classes = shallow.context.styleManager.render(styleSheet);
  });

  it('should render svg text with the text', () => {
    const wrapper = shallow(<Text>Hello</Text>);
    assert.strictEqual(wrapper.is('text'), true, 'should be a span');
    assert.strictEqual(wrapper.childAt(0).equals('Hello'), true);
  });

  it('should spread props', () => {
    const wrapper = shallow(
      <Text data-test="hello">Hello</Text>,
    );
    assert.strictEqual(wrapper.prop('data-test'), 'hello', 'should be spread on the text element');
  });

  it('should merge user classes', () => {
    const wrapper = shallow(<Text className="woof">Hello</Text>);
    assert.strictEqual(wrapper.hasClass('woof'), true, 'should have the woof class');
  });

  textTypes.forEach((textType) => {
    it(`should render ${textType} text`, () => {
      const wrapper = shallow(<Text textType={textType}>Hello</Text>);
      assert.ok(classes[textType] !== undefined);
      assert.strictEqual(wrapper.hasClass(classes[textType]), true, `should be ${textType} text`);
    });
  });
});
