import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash.isequal'
import getArcs from './memoized/getArcs'
import getTree from './memoized/getTree'
import getScales from './memoized/getScales'
import Chart from './Chart'
import { RADIUS } from './constants'

export class Sunburst extends Component {
  state = {
    xDomain: [0, 1],
    yRange: [0, RADIUS],
    yDomain: [0, 1]
  }

  setActiveNode = arc => {
    this.setState(prevState => {
      const { xDomain, yRange, yDomain } = prevState
      const { x0, x1, y0 } = arc

      const xd = [x0, x1]
      const yr = [y0 ? 20 : 0, RADIUS]
      const yd = [y0, 1]

      return {
        xDomain: isEqual(xd, xDomain) ? xDomain : xd,
        yRange: isEqual(yr, yRange) ? yRange : yr,
        yDomain: isEqual(yd, yDomain) ? yDomain : yd
      }
    })
  }

  render() {
    const {
      props: { data },
      state: { xDomain, yDomain, yRange }
    } = this

    const tree = getTree(data)
    const { xScale, yScale, path } = getScales(xDomain, yDomain, yRange)
    const arcs = getArcs(xScale, tree)

    return (
      <Chart
        size={arcs[0].value}
        name={arcs[0].name}
        path={path}
        arcs={arcs}
        xScale={xScale}
        yScale={yScale}
        setActiveNode={this.setActiveNode}
      />
    )
  }
}

Sunburst.propTypes = {
  data: PropTypes.object.isRequired
}

export default Sunburst
