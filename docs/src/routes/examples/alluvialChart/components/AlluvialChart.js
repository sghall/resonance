// @flow weak

import React from 'react';
import TickGroup from 'resonance/TickGroup';
import NodeGroup from 'resonance/NodeGroup';
import Surface from 'docs/src/components/Surface';
import palette from 'docs/src/utils/palette';
import PropTypes from 'prop-types';
import { utcFormat } from 'd3-time-format';
import { VIEW, TRBL } from '../module/constants';

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

        start={(tick) => ({
          opacity: 1e-6,
          transform: `translate(0,${yScale(tick.val)})`,
        })}

        enter={(tick, index, cached) => ({
          opacity: [1e-6, 1],
          transform: [
            `translate(0,${cached(tick.val)})`,
            `translate(0,${yScale(tick.val)})`,
          ],
          timing: { duration },
        })}

        update={(tick) => ({
          opacity: [1],
          transform: [`translate(0,${yScale(tick.val)})`],
          timing: { duration },
        })}

        leave={(tick, index, cached, remove, lazyRemove) => ({
          opacity: [1e-6],
          transform: [`translate(0,${yScale(tick.val)})`],
          timing: { duration },
          events: { end: lazyRemove },
        })}

        render={(node, state) => {
          return (
            <path fill={node.fill} {...state} />
          );
        }}
      />
      <NodeGroup
        data={data}
        keyAccessor={(d) => d.name}

        start={(node) => ({
          opacity: 1e-6,
          d: node.path,
        })}

        enter={(node) => ({
          opacity: [1e-6, 1],
          transform: [node.path],
          timing: { duration },
        })}

        update={(node) => ({
          opacity: [1],
          transform: [node.path],
          timing: { duration },
        })}

        leave={(node, index, remove, lazyRemove) => ({
          opacity: [1e-6],
          timing: { duration },
          events: { end: lazyRemove },
        })}

        render={(node, state) => {
          return (
            <path fill={node.fill} {...state} />
          );
        }}
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
