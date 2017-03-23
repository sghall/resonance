// @flow weak
/* eslint-env mocha */

import React, { Component } from 'react';
import { assert } from 'chai';
import sinon from 'sinon';
import withTransitions from './withTransitions';
import createMount from 'test/utils/createMount';

const props = {
  type: 'APPEAR',
  udid: 'unique_id',
  node: {x: 10, y: 20 },
  removeUDID: () => {},
};

class Node extends Component {

  line = null // ref set in render
  rect = null // ref set in render
  path = null // ref set in render

  render() {
    return (
      <g>
        <line
          ref={(d) => { this.line = d; }}
          x1={0} y1={0}
        />
        <rect
          ref={(d) => { this.rect = d; }}
          x={0} y={0}
        />
        <path
          ref={(d) => { this.path = d; }}
          x={0} y={0}
        />
      </g>
    );
  }
}

describe('withTransitions', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should contain a Node instance', () => {
    const NodeWithTransitions = withTransitions(Node);
    const wrapper = mount(<NodeWithTransitions {...props} />);

    assert.strictEqual(wrapper.find(Node).length, 1);
  });

  it('should call invokeMethodIfExists after mounting', () => {
    const NodeWithTransitions = withTransitions(Node);
    sinon.spy(NodeWithTransitions.prototype, 'invokeMethodIfExists');

    mount(<NodeWithTransitions {...props} />);

    const called = NodeWithTransitions.prototype.invokeMethodIfExists.calledOnce;

    assert.strictEqual(called, true, 'should have been called once');
  });
});
