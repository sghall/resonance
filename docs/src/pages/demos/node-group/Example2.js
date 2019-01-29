// @flow weak

import React, { Component } from 'react'
import { shuffle, range } from 'd3-array'
import { easeBackOut, easeBackInOut } from 'd3-ease'
import NodeGroup from 'docs/src/components/NodeGroup'

const count = 15

function getData() {
  return shuffle(range(count).map((d) => ({ value: d }))).slice(0, count / 1.5)
}

export default class Example extends Component {
  state = {
    width: null,
    items: getData(),
  }

  componentDidMount() {
    this.updateWidth()
    window.addEventListener('resize', this.updateWidth)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth)
  }

  updateWidth = () => {
    this.setState(() => ({ width: this.container.offsetWidth || 200 }))
  }

  container = null

  render() {
    const { items, width } = this.state

    return (
      <div style={{ width: '100%' }} ref={(d) => { this.container = d }}>
        <button onClick={() => this.setState({ items: getData() })}>
          Update
        </button>
        {width === null ? null : (
          <NodeGroup
            data={items}
            keyAccessor={(d) => d.value}

            start={() => ({
              x: 0,
              opacity: 0,
              color: 'green',
            })}

            enter={() => ([
              {
                x: [width * 0.4],
                color: ['yellow'],
                timing: { delay: 500, duration: 500, ease: easeBackOut },
              },
              {
                opacity: [1],
                timing: { duration: 500 },
              },
            ])}

            update={() => ({
              x: [width * 0.4], // handle interrupt, if already at value, nothing happens
              opacity: 1, // make sure opacity set to 1 on interrupt
              color: 'orange',
              timing: { duration: 500, ease: easeBackOut },
            })}

            leave={() => ([
              {
                x: [width * 0.8],
                color: ['white', 'red'],
                timing: { duration: 750, ease: easeBackInOut },
              },
              {
                opacity: [0],
                timing: { delay: 750, duration: 500 },
              },
            ])}

            wrapper="div"
            wrapperStyle={{ margin: 10, height: count * 20, position: 'relative' }}
            nameSpace="http://www.w3.org/1999/xhtml"
          >
            <div
              style={(s, d, k) => (`
                position: absolute;
                transform: translate(${s.x}px, ${+k * 20}px);
                opacity: ${s.opacity};
                color: ${s.color};
              `)}
            >
              {(s, d, k) => `${k + 1} - ${Math.round(s.x)}`}
            </div>
          </NodeGroup>
        )}
      </div>
    )
  }
}
