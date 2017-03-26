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

  Object.keys(transitions).forEach((nameSpace) => {
    const tweens = [];

    Object.keys(transitions[nameSpace]).forEach((attr) => {
      const val = transitions[nameSpace][attr];
      tweens.push(tween.call(this, nameSpace, attr, val));
    });

    const timingConfig = { ...preset, ...timing, time: timeNow() };
    schedule(this, nameSpace, newId(), timingConfig, tweens, events);
  });
}
