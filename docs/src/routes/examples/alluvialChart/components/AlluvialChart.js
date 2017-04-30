// @flow weak

import React from 'react';
import Surface from 'docs/src/components/Surface';
import palette from 'docs/src/utils/palette';
import PropTypes from 'prop-types';
import { utcFormat } from 'd3-time-format';
import { VIEW, TRBL } from '../module/constants';
import PathGroup from './PathGroup';
import TickGroup from './TickGroup';

const dateFormat = utcFormat('%-d/%-m/%Y');

const AlluvialChart = (props) => {
  const { data, xScale, yScale, duration } = props;

  return (
    <Surface view={VIEW} trbl={TRBL}>
      <g>
        {xScale.ticks(4).map((d) => {
          const date = dateFormat(d);

          return (
            <g opacity={0.6} key={date} transform={`translate(${xScale(d)})`}>
              <line
                style={{ pointerEvents: 'none' }}
                x1={0} y1={0}
                x2={0} y2={yScale.range()[0]}
                opacity={0.2}
                stroke={palette.textColor}
              />
              <text
                fontSize="8px"
                textAnchor="middle"
                fill={palette.textColor}
                x={0} y={-10}
              >{date}</text>
            </g>
          );
        })}
      </g>
      <TickGroup
        scale={yScale}
        xScale={xScale}
        duration={duration}
      />
      <PathGroup
        data={data}
        xScale={xScale}
        yScale={yScale}
        duration={duration}
      />
    </Surface>
  );
};

AlluvialChart.propTypes = {
  data: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  duration: PropTypes.number.isRequired,
};

export default AlluvialChart;
