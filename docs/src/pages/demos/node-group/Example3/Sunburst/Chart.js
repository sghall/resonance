import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { interval } from 'd3-timer'
import { easeQuad } from 'd3-ease'
import { arc } from 'd3-shape'
import { interpolate } from 'd3-interpolate'
import { scaleLinear, scaleSqrt } from 'd3-scale'
import Surface from './Surface'
import Arcs from './Arcs'
import { VIEW, TRBL, DIMS } from './constants'

export class Chart extends Component {
  state = {
    duration: 350,
  }

  x = scaleLinear()
  y = scaleSqrt()

  path = arc()
    .startAngle(d => Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))))
    .endAngle(d => Math.max(0, Math.min(2 * Math.PI, this.x(d.x1))))
    .innerRadius(d => Math.max(0, this.y(d.y0)))
    .outerRadius(d => Math.max(0, this.y(d.y1)))
    .padAngle(0.002)

  pathEnd = arc()
    .startAngle(d =>
      Math.max(0, Math.min(2 * Math.PI, this.props.xScale(d.x0)))
    )
    .endAngle(d => Math.max(0, Math.min(2 * Math.PI, this.props.xScale(d.x1))))
    .innerRadius(d => Math.max(0, this.props.yScale(d.y0)))
    .outerRadius(d => Math.max(0, this.props.yScale(d.y1)))
    .padAngle(0.002)

  getScaleInterpolators = props => ({
    xd: interpolate(this.x.domain(), props.xScale.domain()),
    yd: interpolate(this.y.domain(), props.yScale.domain()),
    yr: interpolate(this.y.range(), props.yScale.range())
  })

  arcTween = data => {
    return () => {
      return this.path(data)
    }
  }

  setActivePath = (path, size) => {
    if (!this.transition) {
      this.setState({
        activeSize: size,
        activePath: path
      })
    }
  }

  componentDidMount() {
    const { xScale, yScale } = this.props

    this.x.range(xScale.range()).domain(xScale.domain())
    this.y.range(yScale.range()).domain(yScale.domain())
  }

  componentDidUpdate(prevProps) {
    const { duration } = this.state

    if (
      prevProps.xScale !== this.props.xScale ||
      prevProps.yScale !== this.props.yScale
    ) {
      const { xd, yd, yr } = this.getScaleInterpolators(this.props)

      this.transition = interval(elapsed => {
        const t = easeQuad(elapsed < duration ? elapsed / duration : 1)

        this.x.domain(xd(t))
        this.y.domain(yd(t)).range(yr(t))

        if (t >= 1) {
          this.transition.stop()
          this.transition = null
        }
      })
    }
  }

  componentWillUnmount() {
    if (this.transition) {
      this.transition.stop()
    }
  }

  transition = null

  render() {
    const { arcs, setActiveNode } = this.props
    const { duration } = this.state

    return (
      <div style={{ width: '100%' }}>
        <Surface view={VIEW} trbl={TRBL}>
          <g transform={`translate(${DIMS[0] / 2},${DIMS[1] / 2})`}>
            <Arcs
              arcs={arcs}
              path={this.pathEnd}
              arcTween={this.arcTween}
              duration={duration}
              setActiveNode={setActiveNode}
            />
          </g>
        </Surface>
      </div>
    )
  }
}

Chart.propTypes = {
  arcs: PropTypes.array.isRequired,
  size: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  setActiveNode: PropTypes.func.isRequired
}

export default Chart
