import { scaleLinear, scaleSqrt } from 'd3-scale'
import memoizeOne from 'memoize-one'

function getScales(xDomain, yDomain, yRange) {
  const xScale = scaleLinear()
    .range([0, 2 * Math.PI])
    .domain(xDomain)

  const yScale = scaleSqrt()
    .range(yRange)
    .domain(yDomain)

  return {
    xScale,
    yScale
  }
}

export default memoizeOne(getScales)
