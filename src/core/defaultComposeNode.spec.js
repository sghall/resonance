// @flow weak
/* eslint-env mocha */

import { assert } from 'chai';
import defaultComposeNode from './defaultComposeNode';
import { APPEAR, UPDATE, REMOVE } from './types';

describe('Node Composers', () => {
  /**
   *  compose node from provided data (data, type, udid)
   */
  describe('defaultComposeNode', () => {
    it('given a number, returns an object with number in data key` ', () => {
      assert.deepEqual(
        defaultComposeNode(5, APPEAR, 'key-123'),
        { data: 5, type: APPEAR, udid: 'key-123' },
      );
    });

    it('given a string, returns an object with string in data key` ', () => {
      assert.deepEqual(
        defaultComposeNode('Wu-Tang', UPDATE, 'key-123'),
        { data: 'Wu-Tang', type: UPDATE, udid: 'key-123' },
      );
    });

    it('given an object, returns a spread object with type and udid keys` ', () => {
      assert.deepEqual(
        defaultComposeNode({ x: 10, y: 12 }, REMOVE, 'key-123'),
        { x: 10, y: 12, type: REMOVE, udid: 'key-123' },
      );
    });

    it('given an object, it will overwrite an existing type key` ', () => {
      assert.deepEqual(
        defaultComposeNode({ x: 10, y: 12, type: 4 }, UPDATE, 'key-123'),
        { x: 10, y: 12, type: UPDATE, udid: 'key-123' },
      );
    });

    it('given an object, it will overwrite an existing udid key` ', () => {
      assert.deepEqual(
        defaultComposeNode({ x: 10, y: 12, udid: 4 }, UPDATE, '4'),
        { x: 10, y: 12, type: UPDATE, udid: '4' },
      );
    });
  });
});
