import React, { PureComponent } from 'react'
import { NodeGroup, animated } from 'resonance'
import Surface from 'docs/src/components/Surface'
import palette from 'docs/src/utils/palette'
import PropTypes from 'prop-types'
import { easePoly, easeExp } from 'd3-ease'
import { view, trbl, dims, percentFormat } from './utils'

class BarChart extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    duration: PropTypes.number.isRequired,
  }

  state = {
    xScale0: this.props.xScale,
    xScale1: this.props.xScale,
  }

  componentWillReceiveProps(next) {
    this.setState(() => ({
      xScale0: this.props.xScale,
      xScale1: next.xScale,
    }))
  }

  render() {
    const { data, xScale, yScale, duration } = this.props
    const { xScale0, xScale1 } = this.state

    return (
      <Surface view={view} trbl={trbl}>
        <NodeGroup
          data={xScale.ticks()}
          keyAccessor={d => d}

          start={val => ({
            opacity: 1e-6,
            x: xScale0(val),
          })}

          enter={val => ({
            opacity: [1],
            x: [xScale1(val)],
            timing: { duration, ease: easeExp },
          })}

          update={val => ({
            opacity: [1],
            x: [xScale1(val)],
            timing: { duration, ease: easeExp },
          })}

          leave={val => ({
            opacity: [1e-6],
            x: [xScale1(val)],
            timing: { duration, ease: easeExp },
          })}
        >
          <animated.g
            opacity={s => s.opacity}
            transform={s => `translate(${s.x},0)`}   
          >
            <animated.line
              y2={dims[1]}
              stroke={palette.textColor}
              opacity={0.2}
            />
            <animated.text
              y={-5}
              textAnchor="middle"
              fill={palette.textColor}
              fontSize="10px"
            >
              {(s, d) => percentFormat(d)}
            </animated.text>
          </animated.g>
        </NodeGroup>
        <NodeGroup
          data={data}
          keyAccessor={d => d.name}

          start={(node) => ({
            node: {
              opacity: 1e-6,
              y: 500,
            },
            rect: {
              width: node.xVal,
              height: yScale.bandwidth(),
            },
          })}

          enter={(node) => ({
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

          update={(node) => ({
            node: {
              opacity: [1],
              y: [`translate(0,${node.yVal})`],
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
              fill={palette.primary1Color}
              opacity={0.4}
              width={s => s.rect.width}
              height={s => s.rect.height}
            />
            <animated.text
              dy="0.35em"
              x={-15}
              textAnchor="middle"
              fill={palette.textColor}
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
              {(s, d) => percentFormat(xScale1.invert(d.xVal))}
            </animated.text>
          </animated.g>
        </NodeGroup>
      </Surface>
    )
  }
}

export default BarChart
