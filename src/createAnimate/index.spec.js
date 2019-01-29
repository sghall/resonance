/* eslint-env mocha */

import React from 'react'
import { interpolate, interpolateTransformSvg } from 'd3-interpolate'
import { assert } from 'chai'
import { mount } from 'enzyme'
import createAnimate from '.'

const Animate = createAnimate(function getInterpolator(begValue, endValue, attr) {
  if (attr === 'transform') {
    return interpolateTransformSvg(begValue, endValue)
  }

  return interpolate(begValue, endValue)
})

describe('<Animate />', () => {
  it('should render nodes wrapped in the outer element', done => {
    const wrapper = mount(
      <Animate
        start={{}}
        wrapperClass="node-wrapper"
      >
        <div className="node">{() => 'Node Text'}</div>
      </Animate>,
    )

    setTimeout(() => {
      assert.strictEqual(wrapper.find('.node-wrapper').length, 1)
      done()
    }, 50)
  })
})
