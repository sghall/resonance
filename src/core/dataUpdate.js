// @flow weak

import composeNode from './defaultComposeNode';
import { ENTER, UPDATE, EXIT } from './types';

const dataUpdate = (data, state, keyAccessor) => {
  const { nodes = [], udids = [], removed = {} } = state;
  const nextNodes = [];
  const nextUdids = {};

  for (let i = 0, len0 = data.length; i < len0; i++) {
    const udid = keyAccessor(data[i]);

    let type = ENTER;

    if (udids[udid] && !removed[udid]) {
      type = UPDATE;
    }

    nextNodes.push(composeNode(data[i], type, udid));
    nextUdids[udid] = type;
  }

  for (let j = 0, len1 = nodes.length; j < len1; j++) {
    const node = nodes[j];
    const udid = keyAccessor(node);

    if (!nextUdids[udid] && !removed[udid]) {
      nextNodes.push(composeNode(node, EXIT, udid));
      nextUdids[udid] = EXIT;
    }
  }

  return {
    nodes: nextNodes,
    udids: nextUdids,
    removed: {},
  };
};

export default dataUpdate;
