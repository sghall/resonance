// @flow weak

import React, { Component } from 'react';
import { shuffle, range } from 'd3-array';
import { easeBackOut, easeBackInOut } from 'd3-ease';
import NodeGroup from 'resonance/NodeGroup';

const count = 15;

function getData() {
  return shuffle(range(count).map((d) => ({ value: d }))).slice(0, count / 1.5);
}

export default class Example extends Component {

  state = {
    items: getData(),
  }

  render() {
    const { items } = this.state;

    return (
      <div>
        <button onClick={() => this.setState({ items: getData() })}>
          Update
        </button>
        <NodeGroup
          data={items}
          keyAccessor={(d) => d.value}

          start={() => ({
            x: 50,
            opacity: 0,
            color: 'black',
          })}

          enter={() => ([
            {
              x: [250],
              color: ['green'],
              timing: { delay: 500, duration: 500, ease: easeBackOut },
            },
            {
              opacity: [1],
              timing: { duration: 500 },
            },
          ])}

          update={() => ({
            x: [250], // handle interrupt, if already at 250, nothing happens
            opacity: 1, // make sure opacity set to 1 on interrupt
            color: 'blue',
            timing: { duration: 500, ease: easeBackOut },
          })}

          leave={() => ([
            {
              x: [450],
              color: ['red', 'black'],
              timing: { duration: 750, ease: easeBackInOut },
            },
            {
              opacity: [0],
              timing: { delay: 750, duration: 500 },
            },
          ])}
        >
          {(nodes) => (
            <div style={{ margin: 10, height: count * 20, position: 'relative' }}>
              {nodes.map(({ key, state: { x, opacity, color } }) => (
                <div
                  key={key}
                  style={{
                    position: 'absolute',
                    transform: `translate(${x}px, ${key * 20}px)`,
                    opacity,
                    color,
                  }}
                >
                  {key + 1} - {Math.round(x)}
                </div>
              ))}
            </div>
          )}
        </NodeGroup>
      </div>
    );
  }
}
