import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { hierarchy, partition } from 'd3-hierarchy'
import { arc as d3arc } from 'd3-shape'
import { scaleLinear, scaleSqrt, scaleOrdinal } from 'd3-scale'
import { interpolate } from 'd3-interpolate'
import { NodeGroup, Animate } from 'resonance'
import Surface from 'docs/src/components/Surface'
import data from './data'

const view = [1000, 1000]     // ViewBox: Width, Height
const trbl = [50, 50, 50, 50] // Margins: Top, Right, Bottom, Left

const dims = [
  view[0] - trbl[1] - trbl[3], // Adjusted width
  view[1] - trbl[0] - trbl[2]  // Adjusted height
]

const color = scaleOrdinal().range(['#fdae6b','#fd8d3c','#f16913','#fff5eb','#fee6ce','#fdd0a2','#d94801','#a63603','#7f2704'])

const duration = 500

class Example extends Component {
  constructor(props) {
    super(props)

    this.state = {
      xDomain: [0, 1],
      xRange: [0, 2 * Math.PI],
      yDomain: [0, 1],
      yRange: [0, dims[0] / 2]
    }

    const { xDomain, xRange, yDomain, yRange } = this.state

    this.xScale.domain(xDomain).range(xRange)
    this.yScale.domain(yDomain).range(yRange)
  }

  xScale = scaleLinear()
  yScale = scaleSqrt()

  arc = d3arc()
    .startAngle(d => Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x0))))
    .endAngle(d => Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x1))))
    .innerRadius(d => Math.max(0, this.yScale(d.y0)))
    .outerRadius(d => Math.max(0, this.yScale(d.y1)))

  handleClick = d => {
    this.setState({
      xDomain: [d.x0, d.x1],
      yDomain: [d.y0, 1],
      yRange: [d.y0 ? 20 : 0, dims[0] / 2]
    })
  }

  handleUpdate = (t, xd, yd, yr) => {
    this.xScale.domain(xd(t))
    this.yScale.domain(yd(t)).range(yr(t))
  }

  render() {
    const { root } = this.props
    const { xDomain, yDomain, yRange } = this.state

    const xd = interpolate(this.xScale.domain(), xDomain)
    const yd = interpolate(this.yScale.domain(), yDomain)
    const yr = interpolate(this.yScale.range(), yRange)

    return (
      <div className='container'>
        <Animate
          update={{
            i: t => this.handleUpdate(t, xd, yd, yr),
            timing: { duration }
          }}
        />
        <Surface view={view} trbl={trbl}>
          <g transform={`translate(${dims[0] / 2}, ${dims[1] / 2})`}>
            <NodeGroup
              data={root.descendants()}
              keyAccessor={(d, i) => i}
              wrapper='g'
              wrapperClass='arcs-container'
              start={d => {
                return {
                  path: this.arc(d)
                }
              }}
              update={d => ({
                path: () => this.arc(d),
                timing: { duration }
              })}
            >
              <path
                style='cursor: pointer;'
                d={s => s.path}
                stroke="#424242"
                strokeWidth="1px"
                fill={(s, d) => color((d.children ? d.data : d.parent.data).name)}
                fillRule='evenodd'
                onClick={(s, d) => () => this.handleClick(d)}
              />
            </NodeGroup>
          </g>
        </Surface>
      </div>
    )
  }
}

Example.propTypes = {
  root: PropTypes.object
}

const root = hierarchy(data).sum(d => d.size)
partition()(root)

const App = () => <Example root={root} />

export default App