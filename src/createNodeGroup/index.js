import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BaseNode, interval } from 'kapellmeister'
import mergeKeys from '../core/mergeKeys'
import { ENTER, UPDATE, LEAVE } from '../core/types'

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
          nodes: mergedNodeKeys.map(key => {
            return nodeHash[key]
          }),
          nodeHash,
          nodeKeys: mergedNodeKeys,
        }
      }
  
      return null
    }
  
    componentDidMount() {
      this.startInterval()
    }

    createChild(schema, node, parent) {
      const { state, data } = node

      const child = document.createElementNS('http://www.w3.org/2000/svg', schema.type)
      parent.appendChild(child)

      for (const prop in schema.props) {
        if (prop === 'children') {
          if (typeof schema.props.children === 'function') {
            const value = schema.props.children(state, data)
            child.innerText = value
          } else {
            React.Children.forEach(schema.props.children, c => {
              this.createChild(c, node, child)
            })
          }
        } else if (
          typeof schema.props[prop] === 'string' ||
          typeof schema.props[prop] === 'number'
        ) {
          child.setAttribute(prop, schema.props[prop])
        } else if (typeof schema.props[prop] === 'function') {
          const value = schema.props[prop]
          child.setAttribute(prop, value(state, data))
          node.updaters.push(function() {
            child.setAttribute(prop, value(this.state, this.data))
          })
        }
      }
    }
  
    componentDidUpdate(prevProps) {
      console.log(this.props.children)

      const parent = this.ref.current

      while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
      }

      for (const node of this.state.nodes) {
        this.createChild(this.props.children, node, parent)
      }


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
  
      const nextNodeKeys = []
      const length = nodeKeys.length
  
      for (let i = 0; i < length; i++) {
        const k = nodeKeys[i]
        const n = nodeHash[k]
  
        const isTransitioning = n.isTransitioning()
  
        if (isTransitioning) {
          pending = true
        }
  
        if (n.type === LEAVE && !isTransitioning) {
          delete nodeHash[k]
        } else {
          nextNodeKeys.push(k)
        }
      }
  
      if (!pending) {
        this.interval.stop()
      }
  
      this.setState(() => ({
        nodeKeys: nextNodeKeys,
        nodes: nextNodeKeys.map(key => {
          return nodeHash[key]
        }),
      }))
    }
  
    interval = null
    unmounting = false
  
    render() {
      return <g ref={this.ref} />
    }
  }
}
