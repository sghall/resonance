// @flow weak

import {
  interpolateNumber,
  interpolateString,
  interpolateTransformSvg,
} from 'd3-interpolate';

function attrConstant(name, interpol, value1) {
  return function nullOrInterpol() {
    const value0 = this.getAttribute(name);

    if (value0 === value1) {
      return null;
    }

    return interpol(value0, value1);
  };
}

export default function (name, value) {
  let interpol = interpolateNumber;

  if (name === 'transform') {
    interpol = interpolateTransformSvg;
  } else if (typeof value === 'string') {
    interpol = interpolateString;
  }

  return this.attrTween(name, attrConstant(name, interpol, value));
}
