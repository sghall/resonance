// @flow weak
/* eslint-env mocha */

import React, { Component } from 'react';
import { assert } from 'chai';
import transition from './transition';
import createMount from 'test/utils/createMount';

const DURATION = 500;
const DELAY = 500;

class Test extends Component {

  state = {
    end: 0,
    start: 0,
    interrupt: 0,
  }

  componentDidMount() {
    transition.call(this, {
      line: {
        x1: [5, 200],
        y1: [5, 400],
      },
      rect: {
        x: [5, 1000],
        y: [5, 2000],
      },
      timing: { duration: DURATION },
      events: {
        interrupt: this.onInterrupt.bind(this),
        start: this.onStart.bind(this),
        end: this.onEnd.bind(this),
      },
    });

    transition.call(this, {
      path: {
        opacity: [1e-6, 0.8],
        fill: 'tomato',
      },
      timing: { duration: DURATION, delay: DELAY },
    });
  }

  onStart() {
    this.setState((prevState) => ({
      start: prevState.start + 1,
    }));
  }

  onInterrupt() {
    this.setState((prevState) => ({
      interrupt: prevState.interrupt + 1,
    }));
  }

  onEnd() {
    this.setState((prevState) => ({
      end: prevState.end + 1,
    }));
  }

  line = null // ref set in render
  rect = null // ref set in render
  path = null // ref set in render

  render() {
    return (
      <g>
        <line
          ref={(d) => { this.line = d; }}
          id="my-line"
          x1={0} y1={0}
        />
        <rect
          ref={(d) => { this.rect = d; }}
          id="my-rect"
          x={0} y={0}
        />
        <path
          ref={(d) => { this.path = d; }}
          id="my-path"
          x={0} y={0}
        />
      </g>
    );
  }
}

describe('transition', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  it('should change attributes on refs over time', (done) => {
    mount(<Test />);
    const line = window.document.getElementById('my-line');

    setTimeout(() => {
      assert.strictEqual(+line.getAttribute('x1'), 200, 'should be equal');
      assert.strictEqual(+line.getAttribute('y1'), 400, 'should be equal');
      done();
    }, DURATION * 1.1);
  });

  it('should transition multiple refs', (done) => {
    mount(<Test />);
    const rect = window.document.getElementById('my-rect');
    const line = window.document.getElementById('my-line');

    setTimeout(() => {
      assert.strictEqual(+rect.getAttribute('x'), 1000, 'should be equal');
      assert.strictEqual(+rect.getAttribute('y'), 2000, 'should be equal');

      assert.strictEqual(+line.getAttribute('x1'), 200, 'should be equal');
      assert.strictEqual(+line.getAttribute('y1'), 400, 'should be equal');

      done();
    }, DURATION * 1.1);
  });

  it('should accept a delay in milliseconds', (done) => {
    mount(<Test />);
    const path = window.document.getElementById('my-path');

    setTimeout(() => {
      assert.strictEqual(+path.getAttribute('opacity'), 0.8, 'should be equal');
      done();
    }, (DURATION * 1.1) + DELAY);
  });

  it('should set attributes not in an array immediately', (done) => {
    mount(<Test />);
    const path = window.document.getElementById('my-path');

    setTimeout(() => {
      assert.strictEqual(path.getAttribute('fill'), 'tomato', 'should be equal');
      done();
    }, DURATION * 1.1);
  });

  it('should call the end event handler once per transition', (done) => {
    const wrapper = mount(<Test />);

    setTimeout(() => {
      const count = wrapper.instance().state.end;
      assert.strictEqual(count, 1, 'should be equal to one');
      done();
    }, DURATION * 1.1);
  });

  it('should call the start event handler once per transition', (done) => {
    const wrapper = mount(<Test />);

    setTimeout(() => {
      const count = wrapper.instance().state.start;
      assert.strictEqual(count, 1, 'should be equal to one');
      done();
    }, DURATION * 1.1);
  });

  it('should call the interrupt event handler once if interrupted', (done) => {
    const wrapper = mount(<Test />);
    const instance = wrapper.instance();

    transition.call(instance, {
      line: {
        x1: [5, 200],
        y1: [5, 400],
      },
      rect: {
        x: [5, 1000],
        y: [5, 2000],
      },
      timing: { duration: DURATION },
    });

    setTimeout(() => {
      assert.strictEqual(instance.state.interrupt, 1, 'should be equal to one');
      done();
    }, DURATION * 1.1);
  });
});
