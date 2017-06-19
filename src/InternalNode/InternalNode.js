// @flow weak
/* eslint guard-for-in: "off", no-restricted-syntax: "off" */

function extend(obj, props) {
  for (const i in props) {
    obj[i] = props[i]; // eslint-disable-line no-param-reassign
  }

  return obj;
}

function InternalNode(state = {}, data, type) {
  this.data = data;
  this.type = type;
  this.state = state;
  this.TRANSITION_SCHEDULES = {};
}

extend(InternalNode.prototype, {
  setState(state) {
    const s = this.state;
    extend(s, typeof state === 'function' ? state(s) : state);
  },
  update(data, type) {
    this.data = data;
    this.type = type;

    return this;
  },
});

export default InternalNode;
