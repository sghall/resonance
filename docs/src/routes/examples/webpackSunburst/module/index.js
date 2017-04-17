// @flow weak

import { createSelector } from 'reselect';
import { hierarchy, partition } from 'd3-hierarchy';
import { EXAMPLE_STORE_KEY, RADIUS, PI } from './constants';
import webpackStats from '../../data/webpack-stats.json';

// ********************************************************************
//  ACTIONS
// ********************************************************************
const WEBPACK_SUNBURST_UPDATE_X_DOMAIN = 'WEBPACK_SUNBURST_UPDATE_X_DOMAIN';
const WEBPACK_SUNBURST_UPDATE_Y_DOMAIN = 'WEBPACK_SUNBURST_UPDATE_Y_DOMAIN';

// ********************************************************************
//  ACTION CREATORS
// ********************************************************************
export const updateXDomain = (domain) => ({
  type: WEBPACK_SUNBURST_UPDATE_X_DOMAIN,
  domain,
});

export const updateYDomain = (domain) => ({
  type: WEBPACK_SUNBURST_UPDATE_Y_DOMAIN,
  domain,
});

// ********************************************************************
//  SELECTOR
// ********************************************************************
const getData = (state) => state[EXAMPLE_STORE_KEY].data;

export const makeGetNodes = () => {
  return createSelector(
    [getData],
    (data) => {
      const root = {
        name: 'root',
        children: [],
      };

      const addNode = (parent, node) => {
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
          addNode(child, data.byID[id]);
        });
      };

      data.byID[0].childIDs.forEach((id) => {
        addNode(root, data.byID[id]);
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

      return tree.descendants();
    },
  );
};

// ********************************************************************
//  REDUCER
// ********************************************************************
const initialState = {
  data: webpackStats,
  xRange: [0, 2 * PI],
  xDomain: [0, 1],
  yRange: [0, RADIUS],
  yDomain: [0, 1],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case WEBPACK_SUNBURST_UPDATE_X_DOMAIN:
      return Object.assign({}, state, { xDomain: action.domain });
    case WEBPACK_SUNBURST_UPDATE_Y_DOMAIN:
      return Object.assign({}, state, { yDomain: action.domain });
    default:
      return state;
  }
}
