// @flow weak
/* eslint guard-for-in: "off", no-restricted-syntax: "off" */

function extend(obj, props) {
  for (const i in props) {
    obj[i] = props[i]; // eslint-disable-line no-param-reassign
  }

  return obj;
}

export function InternalNode(initialState) {
  this.state = initialState || {};
  this.TRANSITION_SCHEDULES = {};
}

extend(InternalNode.prototype, {
  setState(state) {
    const s = this.state;
    extend(s, typeof state === 'function' ? state(s) : state);
  },
});
