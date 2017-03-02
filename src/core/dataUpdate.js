// @flow weak

import Immutable from 'immutable';
import {
  APPEAR,
  UPDATE,
  REMOVE,
  REVIVE,
} from './types';

const emptyMap = new Immutable.OrderedMap();

const dataUpdate = ({ data, keyAccessor, composeNode }, nodes = emptyMap) => {
  return new Immutable.OrderedMap().withMutations((n) => {
    for (let i = 0, len = data.length; i < len; i++) {
      const udid = keyAccessor(data[i], i, data);
      const node = nodes.get(udid);

      let type = APPEAR;

      if (node) {
        if (node.type === REMOVE) {
          type = REVIVE;
        } else {
          type = UPDATE;
        }
      }

      n.set(udid, composeNode(data[i], type, udid));
    }

    nodes.toSeq().forEach((node) => {
      if (!n.has(node.udid) && node.type !== REMOVE) {
        n.set(node.udid, composeNode(node, REMOVE, node.udid));
      }
    });
  });
};

export default dataUpdate;
