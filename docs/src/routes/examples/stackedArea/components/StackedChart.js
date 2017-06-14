// @flow weak

import React from 'react';
import TickGroup from 'resonance/TickGroup';
import NodeGroup from 'resonance/NodeGroup';
import Surface from 'docs/src/components/Surface';
import palette from 'docs/src/utils/palette';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import { easePoly } from 'd3-ease';
import { VIEW, TRBL, DIMS } from '../module/constants';
import XAxis from './XAxis';

const numberFormat = format(',');

const StackedChart = (props) => {
  const { data, xScale, yScale, duration, activeSeries } = props;

  return (
    <Surface view={VIEW} trbl={TRBL}>
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="4" height="4">
          <path
            d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"
            style={{ stroke: palette.textColor, strokeWidth: 2, opacity: 0.5 }}
          />
        </pattern>
      </defs>
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
          timing: { duration, ease: easePoly },
        })}

        update={(tick) => ({
          opacity: [1],
          transform: [`translate(0,${yScale(tick.val)})`],
          timing: { duration, ease: easePoly },
        })}

        leave={(tick, index, cached, remove) => ({
          opacity: [1e-6],
          transform: [`translate(0,${yScale(tick.val)})`],
          timing: { duration, ease: easePoly },
          events: { end: remove.lazy },
        })}

        render={(tick, state) => {
          return (
            <g {...state}>
              <line
                x1={0}
                y1={0}
                x2={DIMS[0]}
                y2={0}
                stroke={palette.textColor}
                opacity={0.2}
              />
              <text
                fontSize={'9px'}
                textAnchor="end"
                dy=".35em"
                fill={palette.textColor}
                x={-10}
                y={0}
              >{numberFormat(tick.val)}</text>
            </g>
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
          opacity: [1e-6, 0.8],
          d: [node.path],
          timing: { duration, ease: easePoly },
        })}

        update={(node) => ({
          opacity: [0.8],
          d: [node.path],
          timing: { duration, ease: easePoly },
        })}

        leave={(node, index, remove) => ({
          opacity: [1e-6],
          d: [node.path],
          timing: { duration, ease: easePoly },
          events: { end: remove.lazy },
        })}

        render={(node, state) => {
          return (
            <path
              {...state}
              fill={activeSeries === node.name ? 'url(#hatch)' : node.fill}
            />
          );
        }}
      />
      <XAxis xScale={xScale} yScale={yScale} />
    </Surface>
  );
};

StackedChart.propTypes = {
  data: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  duration: PropTypes.number.isRequired,
  activeSeries: PropTypes.string.isRequired,
};

export default StackedChart;
