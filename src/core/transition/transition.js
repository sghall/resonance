// @flow weak

import { now } from 'd3-timer';
import tween from './tween';
import schedule from './schedule';

// from https://github.com/d3/d3-ease/blob/master/src/cubic.js
function easeCubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2; // eslint-disable-line
}

const defaults = {
  time: null,
  delay: 0,
  duration: 250,
  ease: easeCubicInOut,
};

let id = 0;

function newId() {
  return ++id;
}

export default function transition(transitions, opts, events) {
  Object.keys(transitions).forEach((ref) => {
    const tweens = [];

    Object.keys(transitions[ref]).forEach((attr) => {
      const value = transitions[ref][attr];

      if (Array.isArray(value)) {
        if (value.length === 1) {
          tweens.push(tween.call(this[ref], attr, value[0]));
        } else {
          this[ref].setAttribute(attr, value[0]);
          tweens.push(tween.call(this[ref], attr, value[1]));
        }
      } else {
        this[ref].setAttribute(attr, value);
      }
    });

    const timing = { ...defaults, ...opts, time: now() };
    schedule(this, ref, newId(), timing, tweens, events);
  });
}
