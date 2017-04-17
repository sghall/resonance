// @flow weak

import { createSelector } from 'reselect';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { hierarchy, partition } from 'd3-hierarchy';
import { EXAMPLE_STORE_KEY, RADIUS, PI } from './constants';
import webpackStats from '../../data/webpack-stats.json';

// ********************************************************************
//  ACTIONS
// ********************************************************************
const WEBPACK_SUNBURST_UPDATE_SCALES = 'WEBPACK_SUNBURST_UPDATE_SCALES';

// ********************************************************************
//  ACTION CREATORS
// ********************************************************************
export const updateScales = (node) => ({
  type: WEBPACK_SUNBURST_UPDATE_SCALES,
  node,
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

const getXRange = (state) => state[EXAMPLE_STORE_KEY].xRange;
const getXDomain = (state) => state[EXAMPLE_STORE_KEY].xDomain;
const getYRange = (state) => state[EXAMPLE_STORE_KEY].yRange;
const getYDomain = (state) => state[EXAMPLE_STORE_KEY].yDomain;

export const makeGetScales = () => {
  return createSelector(
    [getXRange, getXDomain, getYRange, getYDomain],
    (xRange, xDomain, yRange, yDomain) => {
      return {
        xScale: scaleLinear().range(xRange).domain(xDomain),
        yScale: scaleSqrt().range(yRange).domain(yDomain),
      };
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

const scaleUpdate = ({ node: { x0, x1, y0 } }) => ({
  xRange: [0, 2 * PI],
  xDomain: [x0, x1],
  yRange: [y0 ? 20 : 0, RADIUS],
  yDomain: [y0, 1],
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case WEBPACK_SUNBURST_UPDATE_SCALES:
      return Object.assign({}, state, scaleUpdate(action));
    default:
      return state;
  }
}
