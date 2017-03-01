// @flow weak
import { createSelector } from 'reselect';
import { scaleLinear, scaleBand } from 'd3-scale';
import { getSortByKey } from 'docs/site/src/utils/helpers';
import { VIEW, TRBL, EXAMPLE_STORE_KEY } from './constants';
import { getInitialValues, getPathsAndScales } from './helpers';

const dims = [
  VIEW[0] - TRBL[1] - TRBL[3],  // Usable dimensions width
  VIEW[1] - TRBL[0] - TRBL[2],  // Usable dimensions height
];

// ********************************************************************
//  ACTIONS
// ********************************************************************
export const STACKED_AREA_REMOVE_NODE = 'STACKED_AREA_REMOVE_NODE';
export const STACKED_AREA_TOGGLE_NAME = 'STACKED_AREA_TOGGLE_NAME';
export const STACKED_AREA_UPDATE_PATHS = 'STACKED_AREA_UPDATE_PATHS';
export const STACKED_AREA_CHANGE_OFFSET = 'STACKED_AREA_CHANGE_OFFSET';

// ********************************************************************
//  ACTION CREATORS
// ********************************************************************
export const removeNode = (udid) => ({
  type: STACKED_AREA_REMOVE_NODE,
  udid,
});

export const toggleName = (index) => ({
  type: STACKED_AREA_TOGGLE_NAME,
  index,
});

export const updatePaths = () => ({
  type: STACKED_AREA_UPDATE_PATHS,
});

export const changeOffset = (name) => ({
  type: STACKED_AREA_CHANGE_OFFSET,
  name,
});

// ********************************************************************
//  SELECTOR
// ********************************************************************
const getRawData = (state) => state[EXAMPLE_STORE_KEY].rawData;
const getSortKey = (state) => state[EXAMPLE_STORE_KEY].sortKey;
const getShowTop = (state) => state[EXAMPLE_STORE_KEY].showTop;

export const makeGetSelectedData = () => {
  return createSelector(
    [getRawData, getSortKey, getShowTop],
    (rawData, sortKey, showTop) => {
      const sort = getSortByKey(sortKey);
      const data = rawData.sort(sort).slice(0, showTop);

      const xExtent = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
      const yDomain = {};

      for (let i = 0; i < data.length; i++) {
        const d = data[i];

        if (d[sortKey] < xExtent[0]) xExtent[0] = d[sortKey];
        if (d[sortKey] > xExtent[1]) xExtent[1] = d[sortKey];

        yDomain[d.State] = true;
      }

      const xScale = scaleLinear()
        .range([0, dims[0]])
        .domain([0, xExtent[1]]);

      const yScale = scaleBand()
        .rangeRound([0, dims[1]])
        .padding(0.1)
        .domain(Object.keys(yDomain));

      return {
        sortKey,
        data: data.map((d) => ({
          udid: d.State,
          xVal: xScale(d[sortKey]),
          yVal: yScale(d.State),
        })),
        xScale,
        yScale,
      };
    },
  );
};

function updateNodes(state, names, offset) {
  const { data, dates, mounted, removed } = state;

  const nodes = {};

  const [paths, x, y] = getPathsAndScales(dims, data, names, dates, offset);

  Object.keys(paths).forEach((path) => {
    nodes[path] = {
      udid: path,
      path: paths[path],
    };

    if (mounted[path] && !removed[path]) {
      nodes[path].type = 'UPDATING';
    } else {
      nodes[path].type = 'ENTERING';
    }
  });

  Object.keys(mounted).forEach((key) => {
    if (!nodes[key] && !removed[key]) {
      nodes[key] = {
        udid: mounted[key].udid,
        path: mounted[key].path,
        type: 'EXITING',
      };
    }
  });

  return {
    mounted: nodes,
    removed: {},
    names,
    dates,
    offset,
    xScale: x,
    yScale: y,
  };
}

// ********************************************************************
//  REDUCER
// ********************************************************************
const [data, names, dates] = getInitialValues(150);
const initialState = { data, names, dates, offset: 'stacked' };

function toggleNode(state, action) {
  const { index } = action;

  const update = [
    ...state.names.slice(0, index),
    { name: state.names[index].name, show: !state.names[index].show },
    ...state.names.slice(index + 1),
  ];

  return updateNodes(state, update, state.offset);
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case STACKED_AREA_TOGGLE_NAME:
      return Object.assign({}, state, toggleNode(state, action));
    case STACKED_AREA_UPDATE_PATHS:
      return Object.assign({}, state, updateNodes(state, state.names, state.offset));
    case STACKED_AREA_CHANGE_OFFSET:
      return Object.assign({}, state, updateNodes(state, state.names, action.name));
    default:
      return state;
  }
}
