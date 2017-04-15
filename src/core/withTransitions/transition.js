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

  if (!this || !this.isReactComponent) {
    throw new Error('transitions must be run against a React Component');
  }

  const events = transitions.events || {};
  delete transitions.events;

  // each event handler should be called only once
  Object.keys(events).forEach((d) => {
    events[d] = once(events[d]);
  });

  const timing = transitions.timing || {};
  delete transitions.timing;

  Object.keys(transitions).forEach((stateKey) => {
    const tweens = [];

    Object.keys(transitions[stateKey]).forEach((attr) => {
      const val = transitions[stateKey][attr];

      if (Array.isArray(val)) {
        if (val.length === 1) {
          tweens.push(tween.call(this, stateKey, attr, val[0]));
        } else {
          this.setState((state) => {
            return { [stateKey]: { ...state[stateKey], [attr]: val[0] } };
          });

          tweens.push(tween.call(this, stateKey, attr, val[1]));
        }
      } else {
        this.setState((state) => {
          return { [stateKey]: { ...state[stateKey], [attr]: val } };
        });
        // This assures any existing transitions are stopped
        tweens.push(tween.call(this, stateKey, attr, val));
      }
    });

    const timingConfig = { ...preset, ...timing, time: timeNow() };
    schedule(this, stateKey, newId(), timingConfig, tweens, events);
  });
}
