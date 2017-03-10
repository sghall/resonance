// @flow weak
/* eslint-env mocha */

import { assert } from 'chai';
import defaultKeyAccessor from './defaultKeyAccessor';

describe('defaultKeyAccessor', () => {
  it('given a number, returns a string key` ', () => {
    assert.strictEqual(defaultKeyAccessor(5), 'key-5');
  });

  it('given a string, returns a string key` ', () => {
    assert.strictEqual(defaultKeyAccessor('Wu-Tang'), 'key-Wu-Tang');
  });

  it('given an object it returns a stringified version` ', () => {
    const object = { id: 123, x: 10, y: 12 };
    const string = JSON.stringify(object);

    assert.strictEqual(defaultKeyAccessor(object), string);
  });

  it('given null, it will return the index with a string prefix` ', () => {
    assert.strictEqual(defaultKeyAccessor(null, 1), 'key-1');
  });

  it('given undefined, it will return the index with a string prefix` ', () => {
    assert.strictEqual(defaultKeyAccessor(undefined, 1), 'key-1');
  });

  it('given a function, it will return the index with a string prefix` ', () => {
    assert.strictEqual(defaultKeyAccessor(() => {}, 1), 'key-1');
  });
});

