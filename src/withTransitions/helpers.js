// @flow weak

let id = 0;

export function newId() {
  return ++id;
}

export function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

// from https://github.com/d3/d3-ease/blob/master/src/cubic.js
export function easeCubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2; // eslint-disable-line
}