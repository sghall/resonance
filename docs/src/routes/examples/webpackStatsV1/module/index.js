// @flow weak

import { createSelector } from 'reselect';
import { pack as packLayout, hierarchy } from 'd3-hierarchy';
import { VIEW, TRBL, EXAMPLE_STORE_KEY } from './constants';
import webpackStats from '../../data/webpack-stats.json';

export const dims = [
  VIEW[0] - TRBL[1] - TRBL[3],  // Usable dimensions width
  VIEW[1] - TRBL[0] - TRBL[2],  // Usable dimensions height
];

// ********************************************************************
//  ACTIONS
// ********************************************************************
const WEBPACK_STATS_V1_UPDATE_ORDER = 'WEBPACK_STATS_V1_UPDATE_ORDER';
const WEBPACK_STATS_V1_UPDATE_COUNT = 'WEBPACK_STATS_V1_UPDATE_COUNT';

// ********************************************************************
//  ACTION CREATORS
// ********************************************************************
export const updateSortOrder = (sortKey) => ({
  type: WEBPACK_STATS_V1_UPDATE_ORDER,
  sortKey,
});

export const updateTopCount = (showTop) => ({
  type: WEBPACK_STATS_V1_UPDATE_COUNT,
  showTop,
});

// ********************************************************************
//  SELECTOR
// ********************************************************************
const getRawData = (state) => state[EXAMPLE_STORE_KEY].data;
const getSortKey = (state) => state[EXAMPLE_STORE_KEY].sortKey;
const getShowTop = (state) => state[EXAMPLE_STORE_KEY].showTop;

const addNode = (parent, node, data) => {
  const child = {
    parent,
    name: node.name,
    size: node.size || 0,
  };

  if (node.size > 0) {
    let next = parent;

    while (next) {
      next.size += node.size;
      next = next.parent;
    }
  } else {
    child.children = [];
  }

  parent.children.push(child);

  node.childIDs.forEach((id) => {
    addNode(child, data.byID[id], data);
  });
};

export const makeGetSelectedData = () => {
  return createSelector(
    [getRawData, getSortKey, getShowTop],
    (data, sortKey, showTop) => {
      const tree = {
        name: 'root',
        size: 0,
        children: [],
      };

      data.byID[0].childIDs.forEach((id) => {
        addNode(tree, data.byID[id], data);
      });

      console.log(tree);

      return {
        sortKey,
        showTop,
        tree,
        data: [],
        xScale: () => 0,
        yScale: () => 0,
      };
    },
  );
};

// ********************************************************************
//  REDUCER
// ********************************************************************
const initialState = { data: webpackStats, showTop: 10, sortKey: 'Under 5 Years' };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case WEBPACK_STATS_V1_UPDATE_ORDER:
      return Object.assign({}, state, { sortKey: action.sortKey });
    case WEBPACK_STATS_V1_UPDATE_COUNT:
      return Object.assign({}, state, { showTop: action.showTop });
    default:
      return state;
  }
}
