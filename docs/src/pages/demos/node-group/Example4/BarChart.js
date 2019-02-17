import React, { PureComponent } from 'react'
import { NodeGroup, animated } from 'resonance'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { easeQuadOut, easeExpOut } from 'd3-ease'
import { view, trbl, dims, percentFormat } from './utils'
import Surface from 'docs/src/components/Surface'

const styles = () => ({
  rect: {
    fill: '#fd8d3c',
    opacity: 0.4,
  },
  label: {
    textAnchor: 'middle',
    fill: '#fff',
    fontSize: 10,
  },
  percent: {
    textAnchor: 'end',
    fill: '#fff',
    fontSize: 10
  },
  line: {
    stroke: '#fff',
    opacity: 0.2,
  }
})

const duration = 1500

class BarChart extends PureComponent {
  state = {
    lastXScale: null,
    currXScale: null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { xScale } = nextProps

    if (!prevState.currXScale) {
      return {
        lastXScale: xScale,
        currXScale: xScale,
      }
    }

    if (prevState.currXScale !== xScale) {
      return {
        lastXScale: prevState.currXScale,
        currXScale: xScale,
      }     
    }

    return null
  }

  render() {
    const { data, xScale, yScale, classes } = this.props
    const { lastXScale } = this.state

    return (
      <Surface view={view} trbl={trbl}>
        <NodeGroup
          data={xScale.ticks()}
          keyAccessor={d => d}
          wrapper='g'
          wrapperClass='ticks'

          start={val => ({
            opacity: 1e-6,
            x: lastXScale(val),
          })}

          enter={val => ({
            opacity: [1],
            x: [xScale(val)],
            timing: { duration, ease: easeExpOut },
          })}

          update={val => ({
            opacity: [1],
            x: [xScale(val)],
            timing: { duration, ease: easeExpOut },
          })}

          leave={val => ({
            opacity: [1e-6],
            x: [xScale(val)],
            timing: { duration, ease: easeExpOut },
          })}
        >
          <animated.g
            opacity={s => s.opacity}
            transform={s => `translate(${s.x},0)`}   
          >
            <animated.line
              className={classes.line}
              y2={dims[1]}
            />
            <animated.text
              className={classes.label}
              y={-5}
            >
              {(s, d) => percentFormat(d)}
            </animated.text>
          </animated.g>
        </NodeGroup>
        <NodeGroup
          data={data}
          keyAccessor={d => d.name}
          wrapper='g'
          wrapperClass='bars'

          start={node => ({
            node: {
              opacity: 1e-6,
              y: 500,
            },
            rect: {
              width: node.xVal,
              height: yScale.bandwidth(),
            },
          })}

          enter={node => ({
            node: {
              opacity: [1],
              y: [node.yVal],
            },
            rect: {
              width: node.xVal,
              height: yScale.bandwidth()
            },
            timing: { duration, ease: easeQuadOut },
          })}

          update={node => ({
            node: {
              opacity: [1],
              y: [node.yVal],
            },
            rect: {
              width: [node.xVal],
              height: [yScale.bandwidth()]
            },
            timing: { duration, ease: easeQuadOut },
          })}

          leave={() => ({
            node: {
              opacity: [1e-6],
              y: [500],
            },
            timing: { duration, ease: easeQuadOut },
          })}
        >
          <animated.g 
            opacity={s => s.node.opacity}
            transform={s => `translate(0,${s.node.y})`}
          >
            <animated.rect
              className={classes.rect}
              width={s => s.rect.width}
              height={s => s.rect.height}
            />
            <animated.text
              className={classes.label}
              dy='.35em'
              x={-15}
              y={yScale.bandwidth() / 2}
            >
              {(s, d) => d.name}
            </animated.text>
            <animated.text
              className={classes.percent}
              dy='.35em'
              x={(s, d) => d.xVal - 3}
              y={yScale.bandwidth() / 2}
            >
              {(s, d) => percentFormat(xScale.invert(d.xVal))}
            </animated.text>
          </animated.g>
        </NodeGroup>
      </Surface>
    )
  }
}

BarChart.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
}

export default withStyles(styles)(BarChart)
