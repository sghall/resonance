// @flow weak

import {
  APPEAR,
  UPDATE,
  REMOVE,
  REVIVE,
} from './types';


const nodeUpdate = (props, state, removed) => {
  const { data, keyAccessor, composeNode } = props;
  const nodes = [];
  const udids = {};

  for (let i = 0, len0 = data.length; i < len0; i++) {
    const udid = keyAccessor(data[i], i, data);

    let type = APPEAR;

    if (state.udids[udid] && !removed.has(udid)) {
      if (state.udids[udid] === REMOVE) {
        type = REVIVE;
      } else {
        type = UPDATE;
      }
    }

    nodes.push(composeNode(data[i], type, udid));
    udids[udid] = type;
  }

  for (let j = 0, len1 = state.nodes.length; j < len1; j++) {
    const node = state.nodes[j];

    if (!udids[node.udid] && !removed.has(node.udid)) {
      nodes.push({ ...node, type: REMOVE });
      udids[node.udid] = REMOVE;
    }
  }

  removed.clear(); // setState is asynch...clear now;

  return { nodes, udids };
};

export default nodeUpdate;
