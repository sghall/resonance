// @flow weak

import { ENTER, UPDATE, LEAVE } from './types';

const dataUpdate = (data, state, keyAccessor) => {
  const { nodes = [], dkeys = [], removed = {} } = state;
  const nextNodes = [];
  const nextUdids = {};

  for (let i = 0, len0 = data.length; i < len0; i++) {
    const dkey = keyAccessor(data[i]);

    let type = ENTER;

    if (dkeys[dkey] && !removed[dkey]) {
      type = UPDATE;
    }

    nextNodes.push(data[i]);
    nextUdids[dkey] = type;
  }

  for (let j = 0, len1 = nodes.length; j < len1; j++) {
    const node = nodes[j];
    const dkey = keyAccessor(node);

    if (!nextUdids[dkey] && !removed[dkey]) {
      nextNodes.push(node);
      nextUdids[dkey] = LEAVE;
    }
  }

  return {
    nodes: nextNodes,
    dkeys: nextUdids,
    removed: {},
  };
};

export default dataUpdate;
