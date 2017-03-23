// @flow weak
/* eslint-env mocha */

import { assert } from 'chai';
import schedule from './schedule';
import { newId, easeCubicInOut } from './helpers';

const preset = {
  time: null,
  delay: 0,
  duration: 250,
  ease: easeCubicInOut,
};

describe('schedule', () => {
  it('should add a TRANSITION_SCHEDULES property to node ', () => {
    const node = { rect: {} };

    schedule(node, 'rect', newId(), preset, []);
    assert.isObject(node.TRANSITION_SCHEDULES, 'should be true');
  });
});
