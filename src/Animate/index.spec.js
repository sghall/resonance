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

  it('should work with no props', done => {
    const wrapper = mount(
      <Animate />
    )

    setTimeout(() => {
      assert.strictEqual(wrapper.find('div').length, 1)
      done()
    }, 50)
  })

  it('should run a interpolations on enter with no other props', done => {
    let last = 0

    const i = t => {
      last = t
      return t
    }
    
    mount(
      <Animate enter={{ t: i }} />
    )

    setTimeout(() => {
      assert.strictEqual(last, 1)
      done()
    }, 300)
  })

  it('should run a interpolations on update with no other props', done => {
    let last = 0

    const i = t => {
      last = t
      return t
    }
    
    const wrapper = mount(
      <Animate update={{ t: i }} />
    )

    setTimeout(() => {
      assert.strictEqual(last, 0)
      wrapper.setProps({ show: true })
    }, 300)

    setTimeout(() => {
      assert.strictEqual(last, 1)
      done()
    }, 600)
  })
})
