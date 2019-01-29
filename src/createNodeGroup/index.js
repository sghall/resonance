import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BaseNode, interval } from 'kapellmeister'
import mergeKeys from '../core/mergeKeys'
import { ENTER, UPDATE, LEAVE } from '../core/types'

const REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g

function kebabCase(str) {
  return str.replace(REGEX, function (match) {
    return '-' + match.toLowerCase()
  })
}

export default function createNodeGroup(getInterpolater, displayName = 'NodeGroup') {
  if (!getInterpolater || typeof getInterpolater !== 'function') {
    throw new Error('[resonance] getInterpolator function is required.')
  }

  class Node extends BaseNode {
    getInterpolator = getInterpolater
  }

  return class NodeGroup extends Component {
    static displayName = displayName

    static propTypes = {
      wrapper: PropTypes.string,
      wrapperStyle: PropTypes.object,
      data: PropTypes.array.isRequired,
      keyAccessor: PropTypes.func.isRequired,
      start: PropTypes.func.isRequired,
      enter: PropTypes.func,
      update: PropTypes.func,
      leave: PropTypes.func,
      children: PropTypes.object.isRequired,
    }

    ref = React.createRef()

    static defaultProps = {
      enter: () => {},
      update: () => {},
      leave: () => {},
    }

    state = {
      nodeKeys: [],
      nodeHash: {},
      nodes: [],
      data: null,
    }
  
    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.data !== prevState.data) {
        const { data, keyAccessor, start, enter, update, leave } = nextProps
        const { nodeKeys, nodeHash } = prevState
  
        const keyIndex = {}
  
        for (let i = 0; i < nodeKeys.length; i++) {
          keyIndex[nodeKeys[i]] = i
        }
  
        const nextKeyIndex = {}
        const nextNodeKeys = []
  
        for (let i = 0; i < data.length; i++) {
          const d = data[i]
          const k = keyAccessor(d, i)
  
          nextKeyIndex[k] = i
          nextNodeKeys.push(k)
  
          if (keyIndex[k] === undefined) {
            const node = new Node()
            node.updaters = []
            node.key = k
            node.data = d
            node.type = ENTER
            nodeHash[k] = node
          }
        }
  
        for (let i = 0; i < nodeKeys.length; i++) {
          const k = nodeKeys[i]
          const n = nodeHash[k]
  
          if (nextKeyIndex[k] !== undefined) {
            n.data = data[nextKeyIndex[k]]
            n.type = UPDATE
          } else {
            n.type = LEAVE
          }
        }
  
        const mergedNodeKeys = mergeKeys(
          nodeKeys,
          keyIndex,
          nextNodeKeys,
          nextKeyIndex,
        )
  
        for (let i = 0; i < mergedNodeKeys.length; i++) {
          const k = mergedNodeKeys[i]
          const n = nodeHash[k]
          const d = n.data
  
          if (n.type === ENTER) {
            n.setState(start(d, nextKeyIndex[k]))
            n.transition(enter(d, nextKeyIndex[k]))
          } else if (n.type === LEAVE) {
            n.transition(leave(d, keyIndex[k]))
          } else {
            n.transition(update(d, nextKeyIndex[k]))
          }
        }
  
        return {
          data,
          nodeHash,
          nodeKeys: mergedNodeKeys,
        }
      }
  
      return null
    }
  
    componentDidMount() {
      this.startInterval()
    }

    createChild(template, node, parent, key, index) {
      const { state, data } = node
      const nameSpace = this.ref.current.namespaceURI

      const child = document.createElementNS(nameSpace, template.type)
      parent.appendChild(child)

      for (const prop in template.props) {
        const attr = kebabCase(prop)

        if (prop === 'children') {
          if (typeof template.props.children === 'function') {
            const value = template.props.children(state, data, key, index)
            child.innerText = value
          } else {
            React.Children.forEach(template.props.children, c => {
              this.createChild(c, node, child, key, index)
            })
          }
        } else if (
          typeof template.props[prop] === 'string' ||
          typeof template.props[prop] === 'number'
        ) {
          child.setAttribute(attr, template.props[prop])
        } else if (typeof template.props[prop] === 'function') {
          const value = template.props[prop]

          if (prop === 'onClick') {
            child.addEventListener('click', value(state, data, key, index))
          } else {
            child.setAttribute(attr, value(state, data, key, index))
            node.updaters.push(function(k, i) {
              child.setAttribute(attr, value(this.state, this.data, k, i))
            })
          }
        }
      }

      return child
    }
  
    componentDidUpdate(prevProps) {
      if (prevProps.data !== this.props.data && !this.unmounting) {
        this.startInterval()
      }
    }
  
    startInterval() {
      if (!this.interval) {
        this.interval = interval(this.animate)
      } else {
        this.interval.restart(this.animate)
      }
    }
  
    componentWillUnmount() {
      const { nodeKeys, nodeHash } = this.state
  
      this.unmounting = true
  
      if (this.interval) {
        this.interval.stop()
      }
  
      nodeKeys.forEach(key => {
        nodeHash[key].stopTransitions()
      })
    }
  
    animate = () => {
      const { nodeKeys, nodeHash } = this.state
  
      if (this.unmounting) {
        return
      }
  
      let pending = false
    
      for (let i = 0; i < nodeKeys.length; i++) {
        const k = nodeKeys[i]
        const n = nodeHash[k]
  
        const isTransitioning = n.isTransitioning()
  
        if (isTransitioning) {
          pending = true
        }
  
        if (n.type === LEAVE && !isTransitioning) {
          n.eject()
          delete nodeHash[k]
          nodeKeys.splice(i, 1)
          i--
        }
      }
  
      if (!pending) {
        this.interval.stop()
      }

      const parent = this.ref.current

      for (let i = 0; i < nodeKeys.length; i++) {
        const k = nodeKeys[i]
        const n = nodeHash[k]

        if (n.type === ENTER && n.updaters.length === 0) {
          const child = this.createChild(this.props.children, n, parent, k, i)
          
          n.eject = () => {
            parent.removeChild(child)
          }
        } else {
          n.updaters.forEach(updater => {
            updater.call(n, k, i)
          })
        }
      }
    }
  
    interval = null
    unmounting = false
  
    render() {
      const { wrapper = 'g', wrapperStyle = {} } = this.props

      return React.createElement(wrapper, {
        ref: this.ref,
        style: wrapperStyle
      })
    }
  }
}
