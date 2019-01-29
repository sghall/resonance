import React from 'react'
import PropTypes from 'prop-types'
import NodeGroup from './NodeGroup'
import { easeLinear } from 'd3-ease'

const COLORS = ['#a63603', '#feedde','#fdbe85','#fd8d3c','#e6550d']

const Arcs = props => {
  const {
    path,
    arcs,
    arcTween,
    duration,
    setActiveNode,
  } = props

  return (
    <NodeGroup
      data={arcs}
      keyAccessor={d => d.filePath}
      wrapper='g'

      start={d => ({
        d: path(d)
      })}

      update={d => {
        if (d.noTransition) {
          return {
            d: path(d)
          }
        }

        return {
          d: arcTween(d),
          timing: { duration, ease: easeLinear }
        }
      }}
    >
      <path
        d={s => s.d}
        style="cursor: pointer;"
        fill={(s, d) => COLORS[d.depth]}
        onClick={(s, d) => {
          return () => setActiveNode(d)
        }}
      />
    </NodeGroup>
  )
}

Arcs.propTypes = {
  path: PropTypes.func.isRequired,
  arcs: PropTypes.array.isRequired,
  arcTween: PropTypes.func.isRequired,
  duration: PropTypes.number.isRequired,
  setActiveNode: PropTypes.func.isRequired
}

export default Arcs
