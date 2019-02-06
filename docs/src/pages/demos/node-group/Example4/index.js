import React, { Component } from 'react'
import { scaleLinear, scaleBand } from 'd3-scale'
import BarChart from './BarChart'
import { dims, getSortByKey } from './utils'
import rawData from './data'

class Example extends Component {

  state = {
    selected: null,
    options: [
      'Under 5 Years',
      '5 to 13 Years',
      '14 to 17 Years',
      '18 to 24 Years',
      '16 Years and Over',
      '18 Years and Over',
      '15 to 44 Years',
      '45 to 64 Years',
      '65 Years and Over',
      '85 Years and Over',
    ],
    data: [],
    xScale: () => 0,
    yScale: () => 0,
  }

  componentDidMount() {
    const [ option ] = this.state.options
    this.setSelected(option)
  }

  setSelected = selected => {
    const sort = getSortByKey(selected)
    const data = rawData.sort(sort).slice(0, 10)

    const xExtent = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    const yDomain = {}

    for (let i = 0; i < data.length; i++) {
      const d = data[i]

      if (d[selected] < xExtent[0]) xExtent[0] = d[selected]
      if (d[selected] > xExtent[1]) xExtent[1] = d[selected]

      yDomain[d.State] = true
    }

    const xScale = scaleLinear()
      .range([0, dims[0]])
      .domain([0, xExtent[1]])

    const yScale = scaleBand()
      .rangeRound([0, dims[1]])
      .padding(0.1)
      .domain(Object.keys(yDomain))

    return {
      selected,
      data: data.map((d) => ({
        name: d.State,
        xVal: xScale(d[selected]),
        yVal: yScale(d.State),
      })),
      xScale,
      yScale,
    }
  }

  render() {
    return (
      <BarChart />
    )
  }
}

export default Example
