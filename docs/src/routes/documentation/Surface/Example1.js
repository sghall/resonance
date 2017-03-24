// @flow weak

import React from 'react';
import Surface from 'resonance/Surface';

const color = 'rgba(0,0,0,0.3)';

const view = [1000, 250];       // [width, height]
const trbl = [10, 10, 40, 100]; // [top, right, bottom, left] margins

const dims = [ // Adjusted dimensions [width, height]
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
];

const Exmaple1 = () => (
  <Surface
    view={view}
    trbl={trbl}
    style={{ backgroundColor: color }}
  >
    <rect width={dims[0]} height={dims[1]} fill={color} />
  </Surface>
);

export default Exmaple1;
