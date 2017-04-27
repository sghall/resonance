/* eslint-env mocha */
/* eslint flowtype/require-valid-file-annotation: "off" */

import { assert } from 'chai';
import schedule from './schedule';
import { newId } from '../helpers';
import { preset } from './transition';

describe('schedule', () => {
  it('should add a TRANSITION_SCHEDULES property to node ', () => {
    const node = { rect: {} };

    schedule(node, 'rect', newId(), preset, []);
    assert.isObject(node.TRANSITION_SCHEDULES, 'should be true');
  });
});
