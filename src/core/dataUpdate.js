// @flow weak

import composeNode from './defaultComposeNode';
import defaultKeyAccessor from './defaultKeyAccessor';
import {
  APPEAR,
  UPDATE,
  EXIT,
} from './types';


const nodeUpdate = (props, state, removed) => {
  const { data, keyAccessor = defaultKeyAccessor } = props;
  const nodes = [];
  const udids = {};

  for (let i = 0, len0 = data.length; i < len0; i++) {
    const udid = keyAccessor(data[i]);

    let type = APPEAR;

    if (state.udids[udid] && !removed.has(udid)) {
      type = UPDATE;
    }

    nodes.push(composeNode(data[i], type, udid));
    udids[udid] = type;
  }

  for (let j = 0, len1 = state.nodes.length; j < len1; j++) {
    const node = state.nodes[j];
    const udid = keyAccessor(node);

    if (!udids[udid] && !removed.has(udid)) {
      nodes.push(composeNode(node, EXIT, udid));
      udids[udid] = EXIT;
    }
  }

  removed.clear(); // setState is asynch...clear now;

  return { nodes, udids };
};

export default nodeUpdate;
