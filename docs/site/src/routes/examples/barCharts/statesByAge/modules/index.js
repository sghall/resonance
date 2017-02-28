// @flow weak

import { rawData } from './data';

export const STATES_BY_AGE_UPDATE_ORDER = 'STATES_BY_AGE_UPDATE_ORDER';
export const STATES_BY_AGE_UPDATE_COUNT = 'STATES_BY_AGE_UPDATE_COUNT';

export function updateSortOrder(sortKey) {
  return {
    type: STATES_BY_AGE_UPDATE_ORDER,
    sortKey,
  };
}

export function updateTopCount(topN) {
  return {
    type: STATES_BY_AGE_UPDATE_COUNT,
    topN,
  };
}

const initialState = {
  view: [500, 400],          // ViewBox: Width, Height
  trbl: [30, 20, 10, 30],    // Margins: Top, Right, Bottom, Left
  rawData,
  showTop: 20,               // Number of bars to show
  sortKey: '18 to 24 Years', // The age group currently selected
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case STATES_BY_AGE_UPDATE_ORDER:
      return Object.assign({}, state, { sortKey: action.sortKey });
    case STATES_BY_AGE_UPDATE_COUNT:
      return Object.assign({}, state, { showTop: action.topN });
    default:
      return state;
  }
}
