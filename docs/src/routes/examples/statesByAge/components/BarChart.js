// @flow weak

import React from 'react';
import TickGroup from 'resonance/TickGroup';
import NodeGroup from 'resonance/NodeGroup';
import Surface from 'docs/src/components/Surface';
import palette from 'docs/src/utils/palette';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import { easePoly, easeExp } from 'd3-ease';
import { VIEW, TRBL, DIMS } from '../module/constants';

const percentFormat = format('.1%');

const BarChart = (props) => {
  const { data, xScale, yScale, duration } = props;

  return (
    <Surface view={VIEW} trbl={TRBL}>
      <TickGroup
        scale={xScale}

        start={(tick, index, prevScale) => ({
          opacity: 1e-6,
          transform: `translate(${prevScale(tick.val)},0)`,
        })}

        enter={(tick) => ({
          opacity: [1],
          transform: [`translate(${xScale(tick.val)},0)`],
          timing: { duration, ease: easeExp },
        })}

        update={(tick) => ({
          opacity: [1],
          transform: [`translate(${xScale(tick.val)},0)`],
          timing: { duration, ease: easeExp },
        })}

        leave={(tick, index, prevScale, remove) => ({
          opacity: [1e-6],
          transform: [`translate(${xScale(tick.val)},0)`],
          timing: { duration, ease: easeExp },
          events: { end: remove },
        })}

        render={(tick, state) => {
          return (
            <g {...state}>
              <line
                x1={0} y1={0}
                x2={0} y2={DIMS[1]}
                stroke={palette.textColor}
                opacity={0.2}
              />
              <text
                x={0} y={-5}
                textAnchor="middle"
                fill={palette.textColor}
                fontSize="10px"
              >{percentFormat(tick.val)}</text>
            </g>
          );
        }}
      />
      <NodeGroup
        data={data}
        keyAccessor={(d) => d.name}

        start={(node) => ({
          node: {
            opacity: 1e-6,
            transform: 'translate(0,500)',
          },
          rect: {
            width: node.xVal,
            height: yScale.bandwidth(),
          },
          text: {
            x: node.xVal - 3,
          },
        })}

        enter={(node) => ({
          node: {
            opacity: [1e-6, 1],
            transform: ['translate(0,500)', `translate(0,${node.yVal})`],
          },
          rect: { width: node.xVal, height: yScale.bandwidth() },
          text: { x: node.xVal - 3 },
          timing: { duration, ease: easePoly },
        })}

        update={(node) => ({
          node: {
            opacity: [1],
            transform: [`translate(0,${node.yVal})`],
          },
          rect: { width: [node.xVal], height: [yScale.bandwidth()] },
          text: { x: [node.xVal - 3] },
          timing: { duration, ease: easePoly },
        })}

        leave={(node, index, remove, lazyRemove) => ({
          node: {
            opacity: [1e-6],
            transform: ['translate(0,500)'],
          },
          timing: { duration, ease: easePoly },
          events: { end: lazyRemove },
        })}

        render={(node, state) => {
          return (
            <g {...state.node}>
              <rect
                fill={palette.primary1Color}
                opacity={0.4}
                {...state.rect}
              />
              <text
                dy="0.35em"
                x={-15}
                textAnchor="middle"
                fill={palette.textColor}
                fontSize={10}
                y={yScale.bandwidth() / 2}
              >{name}</text>
              <text
                textAnchor="end"
                dy="0.35em"
                fill="white"
                fontSize={10}
                y={yScale.bandwidth() / 2}
                {...state.text}
              >{percentFormat(xScale.invert(node.xVal))}</text>
            </g>
          );
        }}
      />
    </Surface>
  );
};

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  duration: PropTypes.number.isRequired,
};

export default BarChart;
