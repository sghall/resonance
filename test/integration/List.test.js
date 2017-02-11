// @flow weak
/* eslint-env mocha */

import React from 'react';
import { assert } from 'chai';
import { spy } from 'sinon';
import { createMountWithContext } from 'test/utils';
import Line from 'src/Line';

describe('<Line> integration', () => {
  let mount;

  before(() => {
    mount = createMountWithContext();
  });
  after(() => {
    mount.cleanUp();
  });

  describe('prop: rootRef', () => {
    it('should be able to get a ref of the root element', () => {
      const refCallback = spy();
      mount(<Line rootRef={refCallback} />);
      assert.strictEqual(refCallback.callCount, 1, 'should call the ref function');
    });
  });
});
