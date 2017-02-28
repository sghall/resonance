// @flow weak
/* eslint-env mocha */

import { assert } from 'chai';
import {
  APPEAR,
  UPDATE,
  REMOVE,
  REVIVE,
  defaultComposeNode,
} from './withManagedData';

describe('withManagedData', () => {
  /**
   *  compose data node from provided data (data, type, udid)
   */
  describe('defaultComposeNode', () => {
    it('given an number, returns an object with number in data key` ', () => {
      assert.deepEqual(
        defaultComposeNode(5, APPEAR, 'KEY-123'),
        { data: 5, type: APPEAR, udid: 'KEY-123' },
      );
    });

    it('given an string, returns an object with string in data key` ', () => {
      assert.deepEqual(
        defaultComposeNode('Wu-Tang', UPDATE, 'KEY-123'),
        { data: 'Wu-Tang', type: UPDATE, udid: 'KEY-123' },
      );
    });

    it('given an object, returns a spread object with type and udid keys` ', () => {
      assert.deepEqual(
        defaultComposeNode({ x: 10, y: 12 }, REMOVE, 'KEY-123'),
        { x: 10, y: 12, type: REMOVE, udid: 'KEY-123' },
      );
    });

    it('given an object, it will overwrite an existing type key` ', () => {
      assert.deepEqual(
        defaultComposeNode({ x: 10, y: 12, type: 4 }, REVIVE, 'KEY-123'),
        { x: 10, y: 12, type: REVIVE, udid: 'KEY-123' },
      );
    });

    // it('converts a decomposed hsla color object to a string` ', () => {
    //   assert.strictEqual(
    //     convertColorToString({ type: 'hsla', values: [100, 50, 25, 0.5] }),
    //     'hsla(100, 50%, 25%, 0.5)',
    //   );
    // });
  });
});

