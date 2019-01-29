import React, { Component } from 'react'
import PropTypes from 'prop-types'
import createNodeGroup from '../createNodeGroup'

const keyAccessor = () => '$$key$$'

export default function createAnimate(getInterpolater, displayName = 'Animate') {
  const NodeGroup = createNodeGroup(getInterpolater, `${displayName}(NodeGroup)`)

  return class Animate extends Component {
    static displayName = displayName

    static propTypes = {
      show: PropTypes.bool.isRequired,
      start: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
      enter: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.array,
        PropTypes.object,
      ]),
      update: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.array,
        PropTypes.object,
      ]),
      leave: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.array,
        PropTypes.object,
      ]),
      wrapper: PropTypes.string,
      wrapperStyle: PropTypes.object,
      children: PropTypes.object.isRequired,
    }

    static defaultProps = {
      show: true,
    }

    render() {
      const { show, start, enter, update, leave, wrapper, wrapperStyle, children } = this.props
      const data = typeof start === 'function' ? start() : start

      return (
        <NodeGroup
          data={show ? [data] : []}
          start={() => data}
          keyAccessor={keyAccessor}
          enter={typeof enter === 'function' ? enter : () => enter}
          update={typeof update === 'function' ? update : () => update}
          leave={typeof leave === 'function' ? leave : () => leave}
          wrapper={wrapper}
          wrapperStyle={wrapperStyle}
        >
          {children}
        </NodeGroup>
      )
    }
  }
}
