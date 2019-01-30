import React, { PureComponent } from 'react'
import { range } from 'd3-array'
import { easeExpInOut } from 'd3-ease'
import { Animate } from 'resonance'

function getRandomColor() {
  return range(6).reduce((m) => {
    return `${m}${'0123456789ABCDEF'[Math.floor(Math.random() * 16)]}`
  }, '#')
}

class Example extends PureComponent {
  state = {
    show: false,
    color: '#00cf77',
  }

  updateShow = () => {
    this.setState((prev) => ({ show: !prev.show }))
  }

  updateColor = () => {
    this.setState(() => ({ show: true, color: getRandomColor() }))
  }

  render() {
    const { updateShow, updateColor, state: { show, color } } = this

    return (
      <div>
        <button onClick={updateShow}>
          Toggle
        </button>
        {show ? (
          <button onClick={updateColor}>
            Update Color
          </button>
        ) : null}
        <Animate
          show={show}

          start={{
            opacity: 0,
            color: color,
          }}

          enter={{
            opacity: [1],
            timing: { duration: 1000, ease: easeExpInOut },
          }}

          update={{
            opacity: [1],
            color: [color],
            timing: { duration: 500, ease: easeExpInOut },
          }}

          leave={[
            {
              color: ['#ff0063'],
              timing: { duration: 1000, ease: easeExpInOut },
            },
            {
              opacity: [0],
              timing: { delay: 500, duration: 500, ease: easeExpInOut },
            },
          ]}
        >
          <div style={s => (`
            opacity: ${s.opacity};
            width: 200px;
            height: 200px;
            margin-top: 10px;
            color: white;
            background-color: ${s.color};
          `)}
          >
            {s =>  s.opacity.toFixed(3)}
          </div>
        </Animate>
      </div>
    )
  }
}

export default Example
