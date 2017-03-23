// @flow weak
/* eslint-env mocha */
/* eslint react/no-multi-comp:0 */

import React, { Component } from 'react';
import { assert } from 'chai';
import createMount from 'test/utils/createMount';
import transition from './transition';
import stop from './stop';

const DURATION = 500;
const DELAY = 50;

// class Path extends Component {
//   componentDidMount() {
//     transition.call(this, {
//       path: {
//         transform: ['translate(0, 0)', 'translate(100, 0)'],
//       },
//       timing: {
//         duration: DURATION,
//         delay: DELAY,
//       },
//     });

//     setTimeout(() => {
//       stop.call(this);
//     }, DELAY * 0.75);
//   }

//   componentWillUnmount() {
//     stop.call(this);
//   }

//   path = null // ref set in render

//   render() {
//     return (
//       <g>
//         <path
//           ref={(d) => { this.path = d; }}
//           x={0} y={0}
//         />
//       </g>
//     );
//   }
// }

class Line extends Component {
  componentDidMount() {
    transition.call(this, {
      line: {
        x1: [200],
        y1: [200],
      },
      timing: {
        duration: DURATION,
        delay: DELAY,
      },
    });

    setTimeout(() => {
      stop.call(this);
    }, DELAY + (DURATION / 2));
  }

  componentWillUnmount() {
    stop.call(this);
  }

  line = null // ref set in render

  render() {
    return (
      <g>
        <line
          ref={(d) => { this.line = d; }}
          x1={0} y1={0}
        />
      </g>
    );
  }
}

describe('stop', () => {
  let mount;

  before(() => {
    mount = createMount();
  });

  after(() => {
    mount.cleanUp();
  });

  // it('should stop all scheduled transitions ', (done) => {
  //   const wrapper = mount(<Path />);
  //   const path = wrapper.instance().path;

  //   setTimeout(() => {
  //     assert.strictEqual(path.getAttribute('transform'), 'translate(0, 0)', 'should be equal');
  //     done();
  //   }, DELAY + (DURATION * 1.1));
  // });

  it('should stop all transitions in progress ', (done) => {
    const wrapper = mount(<Line />);
    const line = wrapper.instance().line;

    setTimeout(() => {
      assert.isAbove(+line.getAttribute('x1'), 0, 'should be true');
      assert.isBelow(+line.getAttribute('x1'), 200, 'should be true');
      assert.isAbove(+line.getAttribute('y1'), 0, 'should be true');
      assert.isBelow(+line.getAttribute('y1'), 200, 'should be true');
      done();
    }, DELAY + (DURATION * 1.1));
  });
});
