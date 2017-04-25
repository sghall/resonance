// @flow weak
/* eslint-env mocha */

import { assert } from 'chai';
import dataUpdate from './dataUpdate';

const keyAccessor = (d) => JSON.stringify(d);

describe('dataUpdate', () => {
  let state;
  let update;

  before(() => {
    state = { udids: {}, nodes: [], removed: {} };
    update = [1, 2, 3, 4, 5].map((d) => ({ x: d, y: d }));
  });

  it('should return an object', () => {
    const res = dataUpdate({ data: update }, state, keyAccessor);
    assert.isObject(res, 'should be true');
  });

  it('should return an object with a udids prop that is an object', () => {
    const res = dataUpdate({ data: update }, state, keyAccessor);
    assert.isObject(res.udids, 'should be true');
  });

  it('should return an object with a nodes prop that is an array', () => {
    const res = dataUpdate({ data: update }, state, keyAccessor);
    assert.isArray(res.nodes, 'should be true');
  });

  it('should clear the removed map before returning', () => {
    state.removed.a = true;
    state.removed.b = true;
    assert.strictEqual(Object.keys(state.removed).length, 2, 'should be equal');
    const { removed } = dataUpdate({ data: update }, state, keyAccessor);
    assert.strictEqual(Object.keys(removed).length, 0, 'should be equal');
  });
});
