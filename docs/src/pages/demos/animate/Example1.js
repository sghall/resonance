import React, { PureComponent } from 'react'
import { feature } from 'topojson'
import { easeQuadOut } from 'd3-ease'
import { Animate, animated } from 'resonance'
import { interpolate } from 'flubber'
import Surface from 'docs/src/components/Surface' // this is just a responsive SVG
import statesJSON from './states.json'

// **************************************************
//  SVG Layout
// **************************************************
const view = [1000, 450] // [width, height]
const trbl = [10, 10, 10, 10] // [top, right, bottom, left] margins

class Example extends PureComponent {
  state = {
    states: feature(statesJSON, statesJSON.objects.states)
      .features.map((d) => {
        return d.geometry.coordinates[0]
      }),
  }

  update = () => { // take the first one, put it at the end
    this.setState(({ states }) => ({
      states: [
        ...states.slice(1),
        states[0],
      ],
    }))
  }

  render() {
    const { update, state: { states } } = this
    const interpolator = interpolate(states[0], states[1])

    return (
      <div>
        <button onClick={update}>Update</button>
        <Surface view={view} trbl={trbl}>
          <Animate
            wrapper='g'

            start={{
              opacity: 0,
              d: interpolator(1),
            }}

            enter={[
              {
                opacity: [0.7],
                timing: { duration: 1000 },
              },
            ]}

            update={{
              d: interpolator,
              timing: { duration: 1000, ease: easeQuadOut },
            }}
          >
            <animated.g transform="translate(100, 0) scale(0.8)">
              <animated.path
                fill="#fd8d3c"
                d={s => s.d}
                opacity={s => s.opacity}
              />
            </animated.g>
          </Animate>
        </Surface>
      </div>
    )
  }
}

export default Example
