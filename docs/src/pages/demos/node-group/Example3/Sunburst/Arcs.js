import React from 'react'
import PropTypes from 'prop-types'
import NodeGroup from './NodeGroup'
import { easeLinear } from 'd3-ease'

const COLORS = [
  '#6C6B74',
  '#2E303E',
  '#9199BE',
  '#54678F',
  '#212624',
  '#3A4751',
  '#1E272E',
  '#0A151D',
  '#030C12',
  '#253517',
  '#5D704E',
  '#324027',
  '#19280C',
  '#0D1903'
]

const Arcs = props => {
  const {
    path,
    arcs,
    arcTween,
    duration,
  } = props

  return (
    <NodeGroup
      data={arcs}
      keyAccessor={d => d.filePath}

      start={d => ({
        opacity: 0.6,
        d: path(d)
      })}

      update={d => {
        if (d.noTransition) {
          return {
            opacity: 0.6,
            d: path(d)
          }
        }

        return {
          opacity: d.angle === 0 ? [1e-6] : 0.6,
          d: arcTween(d),
          timing: { duration, ease: easeLinear }
        }
      }}
    >
      <path
        d={s => s.d}
        style="cursor: pointer;"
        fill={(s, d) => COLORS[d.depth]}
        opacity={0.3}
        stroke='#fff'
        strokeOpacity={0.7}
        strokeWidth={0.5}
      />
    </NodeGroup>
  )
}

Arcs.propTypes = {
  path: PropTypes.func.isRequired,
  arcs: PropTypes.array.isRequired,
  arcTween: PropTypes.func.isRequired,
  duration: PropTypes.number.isRequired,
}

export default Arcs
