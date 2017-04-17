// @flow weak

import { arc } from 'd3-shape';
import { interpolate } from 'd3-interpolate';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { PI } from '../module/constants';

export const x = scaleLinear();
export const y = scaleSqrt();

export const path = arc()
  .startAngle((d) => Math.max(0, Math.min(2 * PI, x(d.x0))))
  .endAngle((d) => Math.max(0, Math.min(2 * PI, x(d.x1))))
  .innerRadius((d) => Math.max(0, y(d.y0)))
  .outerRadius((d) => Math.max(0, y(d.y1)));

export function scaleTween(nextX, nextY) {
  const xd = interpolate(x.domain(), nextX.domain());
  const yd = interpolate(y.domain(), nextY.domain());
  const yr = interpolate(y.range(), nextY.range());

  return (t) => {
    x.domain(xd(t));
    y.domain(yd(t)).range(yr(t));
  };
}

export function arcTween(data) {
  return () => {
    return path(data);
  };
}
