// @flow weak
/* eslint-env mocha */

import { assert } from 'chai';
import dataUpdate from './dataUpdate';

describe('dataUpdate', () => {
  let state;
  let update;
  let removed;

  before(() => {
    state = { udids: {}, nodes: [] };
    update = [1, 2, 3, 4, 5].map((d) => ({ x: d, y: d }));
    removed = new Map();
  });

  it('should return an object', () => {
    const res = dataUpdate({ data: update }, state, removed);
    assert.isObject(res, 'should be true');
  });

  it('should return an object with a udids prop that is an object', () => {
    const res = dataUpdate({ data: update }, state, removed);
    assert.isObject(res.udids, 'should be true');
  });

  it('should return an object with a nodes prop that is an array', () => {
    const res = dataUpdate({ data: update }, state, removed);
    assert.isArray(res.nodes, 'should be true');
  });

  it('should clear the removed map before returning', () => {
    removed.set('a', true);
    removed.set('b', true);
    assert.strictEqual(removed.size, 2, 'should be equal');
    dataUpdate({ data: update }, state, removed);
    assert.strictEqual(removed.size, 0, 'should be equal');
  });
});
