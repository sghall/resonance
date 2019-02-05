import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default function createAnimated(Comp) {
  class AnimatedComponent extends Component {
    static displayName = `Animated(${Comp})`

    static propTypes = {
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func
      ])  
    }

    render() {
      return <Comp { ...this.props } />
    }
  }

  AnimatedComponent.baseType = Comp
  
  return AnimatedComponent
}
