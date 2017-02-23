export const APP_UPDATE_ORDER = 'APP_UPDATE_ORDER';
export const APP_UPDATE_COUNT = 'APP_UPDATE_COUNT';
export const APP_REMOVE_NODE = 'APP_REMOVE_NODE';

export function updateSortOrder(sortKey) {
  return {
    type: APP_UPDATE_ORDER,
    sortKey: sortKey
  };
}

export function updateTopCount(topN) {
  return {
    type: APP_UPDATE_COUNT,
    topN: topN
  };
}

export function removedNode(udid) {
  return {
    type: APP_REMOVE_NODE,
    udid: udid
  };
}
