// @flow weak

import { scaleLinear, scaleBand } from 'd3-scale';
import { rawData } from './data';

export const APP_UPDATE_ORDER = 'APP_UPDATE_ORDER';
export const APP_UPDATE_COUNT = 'APP_UPDATE_COUNT';
export const APP_REMOVE_NODE = 'APP_REMOVE_NODE';

export function updateSortOrder(sortKey) {
  return {
    type: APP_UPDATE_ORDER,
    sortKey,
  };
}

export function updateTopCount(topN) {
  return {
    type: APP_UPDATE_COUNT,
    topN,
  };
}

export function removedNode(udid) {
  return {
    type: APP_REMOVE_NODE,
    udid,
  };
}

const initialState = {
  data: rawData,
  view: [500, 325],          // ViewBox: Width, Height
  trbl: [15, 10, 10, 30],    // Margins: Top, Right, Bottom, Left
  yScale: () => {},          // Y-scale default
  xScale: () => {},          // X-scale default
  mounted: {},               // Currently Mounted Nodes
  removed: {},               // Nodes removed since last update
  showTop: 10,               // Number of bars to show
  sortKey: '18 to 24 Years', // The age group currently selected
};

function sortByKey(key, ascending) {
  return function sort(a, b) {
    let result = 0;

    if (a[key] > b[key]) {
      result = ascending ? 1 : -1;
    }
    if (a[key] < b[key]) {
      result = ascending ? -1 : 1;
    }

    return result;
  };
}

function getUpdateHandler(keyFunc) {
  return function updateHandler({ view, trbl, mounted, removed }, sortKey, data) {
    const nodes = {};

    const dims = [
      view[0] - trbl[1] - trbl[3],
      view[1] - trbl[0] - trbl[2],
    ];

    const x = scaleLinear()
      .range([0, dims[0]])
      .domain([0, data.reduce((m, d) => {
        return m > d[sortKey] ? m : d[sortKey];
      }, 0)]);

    const y = scaleBand()
      .rangeRound([0, dims[1]])
      .padding(0.1)
      .domain(data.map(keyFunc));

    for (let i = 0; i < data.length; i++) {
      const val = data[i];
      const key = keyFunc(val);

      nodes[key] = {
        udid: key,
        yVal: y(key),
        xVal: x(val[sortKey]),
      };

      if (mounted[key] && !removed[key]) {
        nodes[key].type = 'UPDATING';
      } else {
        nodes[key].type = 'ENTERING';
      }
    }

    const keys = mounted.keys();

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (!nodes[key] && !removed[key]) {
        nodes[key] = {
          udid: mounted[key].udid,
          yVal: mounted[key].yVal,
          xVal: mounted[key].xVal,
          type: 'EXITING',
        };
      }
    }

    return {
      mounted: nodes,
      removed: {},
      sortKey,
      xScale: x,
      yScale: y,
    };
  };
}

const update = getUpdateHandler((d) => d.State);

function removeNode(state, udid) {
  return Object.assign({}, state.removed, { [udid]: true });
}

export function reducer(state = initialState, action) {
  let data; // eslint-disable-line no-shadow

  switch (action.type) {
    case APP_UPDATE_ORDER:
      data = state.data.sort(sortByKey(action.sortKey)).slice(0, state.showTop);
      return Object.assign({}, state, update(state, action.sortKey, data));
    case APP_UPDATE_COUNT:
      data = state.data.sort(sortByKey(state.sortKey)).slice(0, action.topN);
      return Object.assign({}, state, update(state, state.sortKey, data), { showTop: action.topN });
    case APP_REMOVE_NODE:
      return Object.assign({}, state, {
        removed: removeNode(state, action.udid),
      });

    default:
      return state;
  }
}
