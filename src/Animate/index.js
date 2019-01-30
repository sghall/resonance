import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NodeGroup from '../NodeGroup'

const keyAccessor = () => '$$key$$'

class Animate extends Component {
  render() {
    const {
      show,
      start,
      enter,
      update,
      leave,
      wrapper,
      wrapperClass,
      wrapperStyle,
      interpolate,
      children,
    } = this.props
    const data = typeof start === 'function' ? start() : start

    return (
      <NodeGroup
        data={show ? [data] : []}
        start={() => data}
        keyAccessor={keyAccessor}
        interpolate={interpolate}
        enter={typeof enter === 'function' ? enter : () => enter}
        update={typeof update === 'function' ? update : () => update}
        leave={typeof leave === 'function' ? leave : () => leave}
        wrapper={wrapper}
        wrapperClass={wrapperClass}
        wrapperStyle={wrapperStyle}
      >
        {children}
      </NodeGroup>
    )
  }
}

Animate.propTypes = {
  /**
   * Tag for wrapping elment: 'g', 'span', etc.  No custom components.
   */
  wrapper: PropTypes.string,
  /**
   * Class to be applied to wrapper.
   */
  wrapperClass: PropTypes.string,
  /**
   * Style object for wrapper.
   */
  wrapperStyle: PropTypes.object,
  /**
   * Boolean value that determines if the child should be rendered or not.
   */
  show: PropTypes.bool.isRequired,
  /**
   * A function that returns an interpolator fiven the begin value, end value, atrr and namespace. See docs for more.
   */
  interpolate: PropTypes.func,
  /**
   * An object or function that returns an obejct to be used as the starting state.
   */

  start: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  /**
   * An object, array of objects, or function that returns an object or array of objects describing how the state should transform on enter.
   */
  enter: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
    PropTypes.object,
  ]),
  /**
   * An object, array of objects, or function that returns an object or array of objects describing how the state should transform on update. ***Note:*** although not required, in most cases it make sense to specify an update prop to handle interrupted enter and leave transitions.
   */
  update: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
    PropTypes.object,
  ]),
  /**
   * An object, array of objects, or function that returns an object or array of objects describing how the state should transform on leave.
   */
  leave: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.array,
    PropTypes.object,
  ]),
  /**
   * A React component tree. No custom components.
   */
  children: PropTypes.func.isRequired,
}

Animate.defaultProps = {
  show: true,
  wrapper: 'div',
}

export default Animate
