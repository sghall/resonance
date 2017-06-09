// @flow weak
/* eslint react/no-multi-comp: 'off' */

import { scaleOrdinal } from 'd3-scale';
import { arc, pie } from 'd3-shape';

import Surface from 'docs/src/components/Surface';
import React, { PureComponent } from 'react';
import NodeGroup from 'resonance/NodeGroup';

const colors = scaleOrdinal()
  .range([
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
  ]);

// **************************************************
//  SVG Layout
// **************************************************
const view = [1000, 550];      // [width, height]
const trbl = [10, 10, 10, 10]; // [top, right, bottom, left] margins

const dims = [ // Adjusted dimensions [width, height]
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
];

const mockData = [
  {
    name: 'Linktype',
  }, {
    name: 'Quaxo',
  }, {
    name: 'Skynoodle',
  }, {
    name: 'Realmix',
  }, {
    name: 'Jetpulse',
  }, {
    name: 'Chatterbridge',
  }, {
    name: 'Riffpedia',
  }, {
    name: 'Layo',
  }, {
    name: 'Oyoba',
  }, {
    name: 'Ntags',
  },
];

const pieLayout = pie()
  .value((d) => d.value)
  .sort(null);

const arcPath = arc()
  .innerRadius((dims[1] / 4))
  .outerRadius((dims[1] / 2));

class Example extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      arcs: this.getArcs(),
    };
  }

  getArcs = () => {
    const data = mockData.map(({ name }) => ({ name, value: Math.random() }));
    return pieLayout(data);
  }

  update = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState(() => ({
      arcs: this.getArcs(),
    }));
  }

  render() {
    const { arcs } = this.state;

    return (
      <div>
        <button onClick={this.update}>
          Randomize
        </button>
        <Surface view={view} trbl={trbl}>
          <g transform={`translate(${dims[0] / 2}, ${dims[1] / 2})`}>
            <NodeGroup
              data={arcs}
              keyAccessor={(d) => d.data.name}

              start={({ startAngle }) => ({
                startAngle,
                endAngle: startAngle,
              })}

              enter={({ endAngle }) => ({
                endAngle: [endAngle],
                timing: { duration: 500 },
              })}

              update={({ startAngle, endAngle }) => ({
                startAngle: [startAngle],
                endAngle: [endAngle],
                timing: { duration: 500 },
              })}

              leave={({ endAngle }, index, remove) => ({
                startAngle: [endAngle],
                endAngle: [endAngle],
                timing: { duration: 500 },
                events: { end: remove },
              })}

              render={({ data: { name } }, state) => {
                const { startAngle, endAngle } = state;

                return (
                  <path
                    fill={colors(name)}
                    d={arcPath({ startAngle, endAngle })}
                  />
                );
              }}
            />
          </g>
        </Surface>
      </div>
    );
  }
}

export default Example;
