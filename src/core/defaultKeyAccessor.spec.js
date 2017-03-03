// @flow weak
/* eslint-env mocha */

import { assert } from 'chai';
import defaultKeyAccessor from './defaultKeyAccessor';

describe('Key Accessors', () => {
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

    it('given an object with id prop returns id as a string` ', () => {
      assert.strictEqual(defaultKeyAccessor({ id: 123, x: 10, y: 12 }), '123');
    });

    it('given an object with udid prop returns udid as a string` ', () => {
      assert.strictEqual(defaultKeyAccessor({ udid: 456, x: 10, y: 12 }), '456');
    });
  });
});

