// @flow weak
/* eslint-env mocha */

import { assert } from 'chai';
import defaultComposeNode from './defaultComposeNode';

describe('defaultComposeNode', () => {
  it('given a number, returns the number` ', () => {
    assert.deepEqual(defaultComposeNode(5), 5, 'should be equal');
  });

  it('given a string, returns the string` ', () => {
    assert.deepEqual(defaultComposeNode('Wu-Tang'), 'Wu-Tang', 'should be equal');
  });

  it('given an object, returns the object` ', () => {
    const object = { x: 10, y: 12 };
    assert.deepEqual(defaultComposeNode(object), object, 'should be equal');
  });
});

