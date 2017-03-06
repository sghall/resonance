// @flow weak

import {
  interpolateNumber,
  interpolateString,
  interpolateTransformSvg,
} from 'd3-interpolate';


function attrTween(name, value) {
  function tween(...args) {
    const node = this;   // eslint-disable-line consistent-this
    const func = value.apply(node, args);
    return func && function attrTick(t) {
      node.setAttribute(name, func(t));
    };
  }

  return tween;
}


function attrConstant(name, interpol, value1) {
  return function nullOrInterpol() {
    const value0 = this.getAttribute(name);

    if (value0 === value1) {
      return null;
    }

    return attrTween.call(this, name, interpol(value0, value1));
  };
}

export default function (name, value) {
  let interpol = interpolateNumber;

  if (name === 'transform') {
    interpol = interpolateTransformSvg;
  } else if (typeof value === 'string') {
    interpol = interpolateString;
  }

  return attrConstant.call(this, name, interpol, value);
}
