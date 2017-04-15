// @flow weak

import { arc } from 'd3-shape';
import { interpolate } from 'd3-interpolate';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { DIMS } from '../module/constants';

const radius = Math.min(...DIMS) / 2;

const x = scaleLinear()
  .range([0, 2 * Math.PI]);

const y = scaleSqrt()
  .range([0, radius]);

export const path = arc()
  .startAngle((d) => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
  .endAngle((d) => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
  .innerRadius((d) => Math.max(0, y(d.y0)))
  .outerRadius((d) => Math.max(0, y(d.y1)));

export function arcTweenZoom(d) {
  const xd = interpolate(x.domain(), [d.x0, d.x1]);
  const yd = interpolate(y.domain(), [d.y0, 1]);
  const yr = interpolate(y.range(), [d.y0 ? 20 : 0, radius]);

  return (data, index) => {
    if (index === 0) {
      return () => arc(data);
    }

    return (t) => {
      x.domain(xd(t));
      y.domain(yd(t)).range(yr(t));

      return arc(data);
    };
  };
}
