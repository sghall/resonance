// @flow weak

import { createSelector } from 'reselect';
import { arc } from 'd3-shape';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { interpolate } from 'd3-interpolate';
import { hierarchy, partition } from 'd3-hierarchy';
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

const radius = Math.min(...dims) / 2;

const x = scaleLinear()
  .range([0, 2 * Math.PI]);

const y = scaleSqrt()
  .range([0, radius]);

const path = arc()
  .startAngle((d) => {
    Math.max(0, Math.min(2 * Math.PI, x(d.x)));
  })
  .endAngle((d) => {
    Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
  })
  .innerRadius((d) => {
    Math.max(0, y(d.y));
  })
  .outerRadius((d) => {
    Math.max(0, y(d.y + d.dy));
  });

export function arcTweenZoom(d) {
  const xd = interpolate(x.domain(), [d.x, d.x + d.dx]);
  const yd = interpolate(y.domain(), [d.y, 1]);
  const yr = interpolate(y.range(), [d.y ? 20 : 0, radius]);

  return (d0, i) => {
    if (i === 0) {
      return () => path(d0);
    }

    return (t) => {
      x.domain(xd(t));
      y.domain(yd(t)).range(yr(t));

      return path(d0);
    };
  };
}

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
      const tree = {
        name: 'root',
        children: [],
      };

      data.byID[0].childIDs.forEach((id) => {
        addNode(tree, data.byID[id], data);
      });

      const root = hierarchy(tree)
        .sum((d) => d.size || 0);

      partition().size(dims)(root);

      console.log('root: ', root);

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
