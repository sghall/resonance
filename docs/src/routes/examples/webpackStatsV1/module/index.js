// @flow weak

import { createSelector } from 'reselect';
import { hierarchy, partition } from 'd3-hierarchy';
import { EXAMPLE_STORE_KEY } from './constants';
import webpackStats from '../../data/webpack-stats.json';

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
    name: node.name,
  };

  if (node.size) {
    child.size = node.size;
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
      const root = {
        name: 'root',
        children: [],
      };

      data.byID[0].childIDs.forEach((id) => {
        addNode(root, data.byID[id], data);
      });

      const tree = hierarchy(root)
        .sum((d) => d.size || 0)
        .sort((a, b) => b.value - a.value);

      partition()(tree);

      tree.each((d) => {
        d.filePath = d.path(tree) // eslint-disable-line no-param-reassign
          .reverse()
          .reduce((m, n) => `${m}/${n.data.name}`, '');
      });

      console.log('tree: ', tree.descendants());

      return {
        sortKey,
        showTop,
        tree,
        data: tree.descendants(),
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
