import React, { PureComponent } from 'react'
import Animate from 'docs/src/components/Animate'
import { easeExpOut } from 'd3-ease'

const trackStyles = {
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  position: 'relative',
  margin: '5px 3px 10px',
  width: 250,
  height: 50,
}

class Example extends PureComponent {
  state = {
    open: false,
  }

  handleClick = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    return (
      <div>
        <button
          onClick={this.handleClick}
        >
          Toggle
        </button>
        <Animate
          start={() => ({
            x: 0,
          })}

          update={() => ({
            x: [this.state.open ? 200 : 0],
            timing: { duration: 750, ease: easeExpOut },
          })}

          wrapperStyle={trackStyles}
        >
          <div
            style={s => (`
              position: absolute;
              width: 50px;
              height: 50px;
              border-radius: 4px;
              opacity: 0.7;
              background-color: #fd8d3c;
              transform: translate3d(${s.x}px, 0, 0);
            `)}
          />
        </Animate>
      </div>
    )
  }
}

export default Example
