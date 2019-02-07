import React, { PureComponent } from 'react'
import { NodeGroup, animated } from 'resonance'
import PropTypes from 'prop-types'
import { easePoly, easeExp } from 'd3-ease'
import { view, trbl, dims, percentFormat } from './utils'
import Surface from 'docs/src/components/Surface'

const textColor = '#fff'
const fillColor = '#fd8d3c'

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
    const { data, xScale, yScale } = this.props
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
            timing: { duration, ease: easeExp },
          })}

          update={val => ({
            opacity: [1],
            x: [xScale(val)],
            timing: { duration, ease: easeExp },
          })}

          leave={val => ({
            opacity: [1e-6],
            x: [xScale(val)],
            timing: { duration, ease: easeExp },
          })}
        >
          <animated.g
            opacity={s => s.opacity}
            transform={s => `translate(${s.x},0)`}   
          >
            <animated.line
              y2={dims[1]}
              stroke={textColor}
              opacity={0.2}
            />
            <animated.text
              y={-5}
              textAnchor="middle"
              fill={textColor}
              fontSize="10px"
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
            timing: { duration, ease: easePoly },
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
            timing: { duration, ease: easePoly },
          })}

          leave={() => ({
            node: {
              opacity: [1e-6],
              y: [500],
            },
            timing: { duration, ease: easePoly },
          })}
        >
          <animated.g 
            opacity={s => s.node.opacity}
            transform={s => `translate(0,${s.node.y})`}
          >
            <animated.rect
              fill={fillColor}
              opacity={0.4}
              width={s => s.rect.width}
              height={s => s.rect.height}
            />
            <animated.text
              dy="0.35em"
              x={-15}
              textAnchor="middle"
              fill={textColor}
              fontSize={10}
              y={yScale.bandwidth() / 2}
            >
              {(s, d) => d.name}
            </animated.text>
            <animated.text
              textAnchor="end"
              dy="0.35em"
              fill="white"
              fontSize={10}
              y={yScale.bandwidth() / 2}
              x={(s, d) => d.xVal - 3}
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
  data: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
}

export default BarChart
