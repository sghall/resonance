import React, { Component } from 'react'
import { scaleLinear, scaleBand } from 'd3-scale'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import BarChart from './BarChart'
import { dims, getSortByKey } from './utils'
import rawData from './data'

const barCount = 10

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
    xScale: scaleLinear(),
    yScale: scaleBand(),
  }

  componentDidMount() {
    const [ option ] = this.state.options
    this.setSelected(option)
  }

  setSelected = selected => {
    const sort = getSortByKey(selected)
    const data = rawData.sort(sort).slice(0, barCount)

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

    this.setState({
      selected,
      data: data.map((d) => ({
        name: d.State,
        xVal: xScale(d[selected]),
        yVal: yScale(d.State),
      })),
      xScale,
      yScale,
    })
  }

  render() {
    const { data, options, selected, xScale, yScale } = this.state 

    return (
      <Grid container style={{ paddingTop: 20 }}>
        <Grid item xs={12} sm={3} style={{ paddingTop: 20 }}>
          <Typography gutterBottom variant="h6" align="center">
            Age Group
          </Typography>
          {options.map(option => (
            <Button
              key={option}
              variant="outlined"
              fullWidth
              disabled={selected === option}
              onClick={() => this.setSelected(option)}
            >
              {option}
            </Button>
          ))}
        </Grid>
        <Grid item xs={12} sm={9}>
          <BarChart
            data={data}
            xScale={xScale}
            yScale={yScale}
          />
        </Grid>
      </Grid>
    )
  }
}

export default Example
