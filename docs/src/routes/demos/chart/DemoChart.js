// @flow weak
import React from 'react';
import Chart from 'resonance/Chart';

export default function DemoChart() {
  return (
    <Chart
      view={[1000, 500]}
      trbl={[100, 100, 100, 100]}
      style={{ backgroundColor: 'rgba(0,0,0,0.1)', marginTop: 30 }}
    >
      <rect
        fill="tomato"
        width={200}
        height={300}
      />
      <rect
        fill="tomato"
        width={200}
        height={300}
        transform="translate(300, 0)"
      />
      <rect
        fill="tomato"
        width={200}
        height={300}
        transform="translate(600, 0)"
      />
    </Chart>
  );
}
