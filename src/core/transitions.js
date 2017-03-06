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

export default function (node, ref, name, id, timing) {
  const schedules = node.TRANSITION_SCHEDULES;

  if (!schedules) {
    throw new Error('No TRANSITION_SCHEDULES object found');
  } else if (id in schedules) {
    return;
  }

  const { time, delay, duration, ease } = timing;

  create(node, id, {
    ref,
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

export function init(node, id) {
  const schedule = node.TRANSITION_SCHEDULES;

  if (!schedule || !schedule[id] || schedule[id].state > CREATED) {
    throw new Error('too late');
  }

  return schedule;
}

export function set(node, id) {
  const schedule = node.TRANSITION_SCHEDULES;
  if (!schedule || !schedule[id] || schedule[id].state > STARTING) {
    throw new Error('too late');
  }

  return schedule[id];
}

export function get(node, id) {
  const schedule = node.TRANSITION_SCHEDULES;
  if (!schedule || schedule[id]) {
    throw new Error('too late');
  }

  return schedule[id];
}

function create(node, id, config) {
  const schedules = node.TRANSITION_SCHEDULES;

  let tween;

  // Initialize the transition timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  const transition = { ...config };

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

  function start(elapsed) {
    let i;
    let j;
    let n;
    let o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (transition.state !== SCHEDULED) return stop();

    for (i in schedules) { // eslint-disable-line
      o = schedules[i];

      if (o.name !== transition.name) {
        continue; // eslint-disable-line
      }

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return timeout(start);

      // 1. Interrupt the active transition, if any. dispatch the interrupt event.
      // 2. Cancel any pre-empted transitions. No interrupt event is dispatched
      // because the cancelled transitions never started. Note that this also
      // removes this transition from the pending list!

      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call('interrupt', node);
        delete schedules[i];
      } else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout(function() {
      if (transition.state === STARTED) {
        transition.state = RUNNING;
        transition.timer.restart(tick, transition.delay, transition.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    transition.state = STARTING;
    transition.on.call("start", node, node.__data__, transition.index, transition.group);
    if (transition.state !== STARTING) return; // interrupted
    transition.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = transition.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = transition.tween[i].value.call(node, node.__data__, transition.index, transition.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < transition.duration ? transition.ease.call(null, elapsed / transition.duration) : (transition.timer.restart(stop), transition.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(null, t);
    }

    // Dispatch the end event.
    if (transition.state === ENDING) {
      transition.on.call("end", node, node.__data__, transition.index, transition.group);
      stop();
    }
  }

  function stop() {
    transition.state = ENDED;
    transition.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.TRANSITION_SCHEDULES;
  }
}