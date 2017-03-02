// @flow weak
/* eslint-env mocha */

import { assert } from 'chai';
import {
  APPEAR,
  UPDATE,
  REMOVE,
  REVIVE,
  defaultComposeNode,
  defaultKeyAccessor,
} from './withManagedData';

describe('withManagedData', () => {
  /**
   *  Create a string data key from given data
   */
  describe('defaultKeyAccessor', () => {
    it('given a number, returns a string key` ', () => {
      assert.strictEqual(defaultKeyAccessor(5), 'key-5');
    });

    it('given a string, returns a string key` ', () => {
      assert.strictEqual(defaultKeyAccessor('Wu-Tang'), 'key-Wu-Tang');
    });

    it('given an object with id prop returns key-{id}` ', () => {
      assert.strictEqual(defaultKeyAccessor({ id: 123, x: 10, y: 12 }), 'key-123');
    });

    it('given an object with udid prop returns key-{udid}` ', () => {
      assert.strictEqual(defaultKeyAccessor({ udid: 456, x: 10, y: 12 }), 'key-456');
    });
  });
  /**
   *  compose data node from provided data (data, type, udid)
   */
  describe('defaultComposeNode', () => {
    it('given an number, returns an object with number in data key` ', () => {
      assert.deepEqual(
        defaultComposeNode(5, APPEAR, 'key-123'),
        { data: 5, type: APPEAR, udid: 'key-123' },
      );
    });

    it('given an string, returns an object with string in data key` ', () => {
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
        defaultComposeNode({ x: 10, y: 12, type: 4 }, REVIVE, 'key-123'),
        { x: 10, y: 12, type: REVIVE, udid: 'key-123' },
      );
    });
  });
});

