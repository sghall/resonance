// @flow weak

import {
  interpolateRgb,
  interpolateNumber,
  interpolateString,
  interpolateTransformSvg,
} from 'd3-interpolate';
import { color } from 'd3-color';

function getTween(name, interpol, value1) {
  return function nullOrTween() {
    const value0 = this.getAttribute(name);

    if (value0 === `${value1}`) {
      return null;
    }

    const i = interpol(value0, value1);

    const tween = (t) => {
      this.setAttribute(name, i(t));
    };

    return tween;
  };
}

export function getInterpolator(attr, value) {
  if (attr === 'transform') {
    return interpolateTransformSvg;
  } else if (typeof value === 'number') {
    return interpolateNumber;
  } else if (value instanceof color || color(value) !== null) {
    return interpolateRgb;
  }

  return interpolateString;
}

export default function(name, value) {
  return getTween.call(this, name, getInterpolator(name, value), value);
}
