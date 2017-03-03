// @flow weak

import React from 'react';
import Surface from 'resonance/Surface';

export default function SurfaceDemo() {
  return (
    <Surface
      view={[1000, 500]}
      trbl={[100, 100, 100, 100]}
      style={{ backgroundColor: 'rgba(127,127,127,0.5)', marginTop: 30 }}
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
    </Surface>
  );
}
