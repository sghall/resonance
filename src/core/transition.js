// @flow weak
import { easeCubicInOut } from 'd3-ease';
import { now } from 'd3-timer';
import tween from './tween';
import schedule from './schedule';

const defaultTiming = {
  time: null,
  delay: 0,
  duration: 250,
  ease: easeCubicInOut,
};

let id = 0;

function newId() {
  return ++id;
}

function transition(transitions, opts, events) {
  const timing = { ...defaultTiming, ...opts, time: now() };

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

    schedule(this, ref, newId(), timing, tweens, events);
  });
}

export default transition;
