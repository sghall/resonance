// @flow weak

import { dispatch } from 'd3-dispatch';
import { timer, timeout } from 'd3-timer';

const emptyOn = dispatch('start', 'end', 'interrupt');
const emptyTween = [];

export const CREATED = 0;
export const SCHEDULED = 1;
export const STARTING = 2;
export const STARTED = 3;
export const RUNNING = 4;
export const ENDING = 5;
export const ENDED = 6;

export default function (node, name, id, timing) {
  const schedules = node.TRANSITION_SCHEDULES;

  if (!schedules) {
    throw new Error('No TRANSITION_SCHEDULES object found');
  } else if (id in schedules) {
    return;
  }

  const { time, delay, duration, ease } = timing;

  create(node, id, {
    name,
    on: emptyOn,
    tween: emptyTween,
    time,
    delay,
    duration,
    ease,
    timer: null,
    state: CREATED,
  });
}

function create(node, id, config) {
  const schedules = node.TRANSITION_SCHEDULES;

  // Initialize the transition timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  const transition = { ...config };
  const tween = new Array(transition.tween.length);

  schedules[id] = transition;
  transition.timer = timer(schedule, 0, transition.time);

  function schedule(elapsed) {
    transition.state = SCHEDULED;
    transition.timer.restart(start, transition.delay, transition.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (transition.delay <= elapsed) {
      start(elapsed - transition.delay);
    }
  }

  function start(elapsed) { // eslint-disable-line consistent-return
    // If the state is not SCHEDULED, then we previously errored on start.
    if (transition.state !== SCHEDULED) return stop();

    for (const sid in schedules) { // eslint-disable-line
      const s = schedules[sid];

      if (s.name !== transition.name) {
        continue; // eslint-disable-line no-continue
      }

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (s.state === STARTED) return timeout(start);

      // 1. Interrupt the active transition, if any. dispatch the interrupt event.
      // 2. Cancel any pre-empted transitions. No interrupt event is dispatched
      // because the cancelled transitions never started. Note that this also
      // removes this transition from the pending list!

      if (s.state === RUNNING) {
        s.state = ENDED;
        s.timer.stop();
        s.on.call('interrupt', node, transition.ref);
        delete schedules[sid];
      } else if (sid < id) {
        s.state = ENDED;
        s.timer.stop();
        delete schedules[sid];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout(() => {
      if (transition.state === STARTED) {
        transition.state = RUNNING;
        transition.timer.restart(tick, transition.delay, transition.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event. Note this must be done before the tween are initialized.
    transition.state = STARTING;
    transition.on.call('start', node);

    if (transition.state !== STARTING) { // interrupted
      return; // eslint-disable-line consistent-return
    }

    transition.state = STARTED;

    // Initialize the tween, deleting null tween.
    let j = -1;

    for (let i = 0; i < transition.tween.length; ++i) {
      const res = transition.tween[i].value.call(node);

      if (res) {
        tween[j++] = res;
      }
    }

    tween.length = j + 1;
  }

  function tick(elapsed) {
    let t = 1;

    if (elapsed < transition.duration) {
      t = transition.ease.call(null, elapsed / transition.duration);
    } else {
      transition.timer.restart(stop);
      transition.state = ENDING;
    }

    let i = -1;
    const n = tween.length;

    while (++i < n) {
      tween[i].call(null, t);
    }

    // Dispatch the end event.
    if (transition.state === ENDING) {
      transition.on.call('end', node);
      stop();
    }
  }

  function stop() {
    transition.state = ENDED;
    transition.timer.stop();
    delete schedules[id];
  }
}
