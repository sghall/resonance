// @flow weak

import { now as timeNow } from 'd3-timer';
import once from 'lodash/once';
import tween from './tween';
import schedule from './schedule';
import { newId, easeCubicInOut } from './helpers';

const preset = {
  time: null,
  delay: 0,
  duration: 250,
  ease: easeCubicInOut,
};

export default function transition(config) {
  const transitions = { ...config };

  const events = transitions.events || {};
  delete transitions.events;

  // each event handler should be called only once
  Object.keys(events).forEach((d) => {
    events[d] = once(events[d]);
  });

  const timing = transitions.timing || {};
  delete transitions.timing;

  Object.keys(transitions).forEach((refName) => {
    const tweens = [];

    Object.keys(transitions[refName]).forEach((attr) => {
      const val = transitions[refName][attr];
      const ref = this[refName];

      if (!ref) {
        const name = this.constructor.name || 'Component';
        throw new Error(`No ref "${refName}" found on ${name}`);
      }

      if (Array.isArray(val)) {
        if (val.length === 1) {
          tweens.push(tween.call(this[refName], attr, val[0]));
        } else {
          this[refName].setAttribute(attr, val[0]);
          tweens.push(tween.call(this[refName], attr, val[1]));
        }
      } else {
        this[refName].setAttribute(attr, val);
        // This assures any existing transitions are killed
        tweens.push(tween.call(this[refName], attr, val));
      }
    });

    const timingConfig = { ...preset, ...timing, time: timeNow() };
    schedule(this, refName, newId(), timingConfig, tweens, events);
  });
}
