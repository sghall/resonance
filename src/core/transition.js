// @flow weak
import { easeCubicInOut } from 'd3-ease';
import { now } from 'd3-timer';
import tween from './tween';
import schedule from './schedule';

const defaultTiming = {
  time: null,
  delay: 0,
  duration: 1000,
  ease: easeCubicInOut,
};

let id = 0;

function newId() {
  return ++id;
}

function transition(transitions, opts) {
  const timing = { ...defaultTiming, ...opts, time: now() };

  Object.keys(transitions).forEach((ref) => {
    const tweens = [];

    Object.keys(transitions[ref]).forEach((attr) => {
      const value = transitions[ref][attr];

      if (Array.isArray(value)) {
        this[ref].setAttribute(attr, value[0]);
        tweens.push(tween.call(this[ref], attr, value[1]));
      } else {
        tweens.push(tween.call(this[ref], attr, value));
      }
    });

    schedule(this, ref, `${ref}`, newId(), timing, tweens);
  });
}

export default transition;
