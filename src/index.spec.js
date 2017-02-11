// @flow weak
/* eslint-env mocha */

/**
 * Important: This test also serves as a point to
 * import the entire lib for coverage reporting
 */

import { assert } from 'chai';
import * as MaterialCharts from './index';

describe('Material Charts', () => it('should have exports', () => assert.ok(MaterialCharts)));
