/* eslint-env mocha */

import React from 'react'
import { assert } from 'chai'
import { mount } from 'enzyme'
import Animate from '.'

describe('<Animate />', () => {
  it('should render nodes wrapped in the outer element', done => {
    const wrapper = mount(
      <Animate start={{}} wrapperClass="node-wrapper">
        <div className="node">{() => 'Node Text'}</div>
      </Animate>,
    )

    setTimeout(() => {
      assert.strictEqual(wrapper.find('.node-wrapper').length, 1)
      done()
    }, 50)
  })
})
