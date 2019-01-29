/* eslint-env mocha */

import React from 'react'
import { interpolate, interpolateTransformSvg } from 'd3-interpolate'
import sinon from 'sinon'
import { assert } from 'chai'
import { mount } from 'enzyme'
import createNodeGroup from '.'

const NodeGroup = createNodeGroup(function getInterpolator(begValue, endValue, attr) {
  if (attr === 'transform') {
    return interpolateTransformSvg(begValue, endValue)
  }

  return interpolate(begValue, endValue)
})

function getData() {
  return [1, 2, 3, 4, 5].map(d => ({ val: d, key: `key-${d}` }))
}

const keyAccessor = d => d.key

describe('<NodeGroup />', () => {
  it('should render nodes wrapped in the outer element', done => {
    const wrapper = mount(
      <NodeGroup
        data={getData()}
        keyAccessor={keyAccessor}
        start={() => ({})}
        wrapperClass="node-wrapper"
      >
        <div className="node">{() => 'Node Text'}</div>
      </NodeGroup>,
    )

    setTimeout(() => {
      assert.strictEqual(wrapper.find('.node-wrapper').length, 1)
      done()
    }, 50)
  })

  it('should render a node for each data item', done => {
    const wrapper = mount(
      <NodeGroup
        data={getData()}
        keyAccessor={keyAccessor}
        start={() => ({})}
      >
        <div className="node" />
      </NodeGroup>,
    )

    setTimeout(() => {
      assert.strictEqual(
        wrapper.html(), 
        '<div class=""><div class="node"></div><div class="node"></div><div class="node"></div><div class="node"></div><div class="node"></div></div>')
      done()
    }, 50)
  })

  it('should remove nodes that are not transitioning', (done) => {
    const data = getData()

    const wrapper = mount(
      <NodeGroup
        data={getData()}
        keyAccessor={keyAccessor}
        start={() => ({})}
      >
        <div className="node" />
      </NodeGroup>,
    )

    const data2 = data.slice(1)

    wrapper.setProps({ data: data2 })

    setTimeout(() => {
      assert.strictEqual(wrapper.state().nodeKeys.length, data2.length)
      done()
    }, 500)
  })

  it('should call startInterval when given new data prop', () => {
    const data = getData()

    const wrapper = mount(
      <NodeGroup data={data} keyAccessor={keyAccessor} start={() => ({})}>
        <div className="node" />
      </NodeGroup>,
    )

    const spy = sinon.spy(NodeGroup.prototype, 'startInterval')

    wrapper.setProps({ data: data.slice(0, 2) })

    const callCount = NodeGroup.prototype.startInterval.callCount
    spy.restore()

    assert.strictEqual(callCount, 1, 'should have been called once')
  })

  it('should not call startInterval when passed same data prop', () => {
    const data = getData()

    const wrapper = mount(
      <NodeGroup data={data} keyAccessor={d => d.val} start={() => ({})}>
        <div className="node" />
      </NodeGroup>,
    )

    const spy = sinon.spy(NodeGroup.prototype, 'startInterval')

    wrapper.setProps({ data })

    const callCount = NodeGroup.prototype.startInterval.callCount
    spy.restore()

    assert.strictEqual(callCount, 0, 'should not have been called')
  })
})
