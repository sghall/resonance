// @flow weak

import { createSelector } from 'reselect';
import { scaleLinear, scaleBand } from 'd3-scale';

const view = [500, 400];        // ViewBox: Width, Height
const trbl = [15, 20, 10, 30];  // Margins: Top, Right, Bottom, Left

const dims = [
  view[0] - trbl[1] - trbl[3],  // Usable dimensions width
  view[1] - trbl[0] - trbl[2],  // Usable dimensions height
];

function getSortByKey(key, ascending) {
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

const getRawData = (state) => state['states-by-age'].rawData;
const getSortKey = (state) => state['states-by-age'].sortKey;
const getShowTop = (state) => state['states-by-age'].showTop;

const makeGetSelectedData = () => {
  return createSelector(
    [getRawData, getSortKey, getShowTop],
    (rawData, sortKey, showTop) => {
      const sort = getSortByKey(sortKey);
      const data = rawData.sort(sort).slice(0, showTop);

      const xExtent = [Infinity, -Infinity];
      const yDomain = {};

      for (let i = 0; i < data.length; i++) {
        const d = data[i];

        if (d[sortKey] < xExtent[0]) xExtent[0] = d[sortKey];
        if (d[sortKey] > xExtent[1]) xExtent[1] = d[sortKey];

        yDomain[d.State] = true;
      }

      const x = scaleLinear()
        .range([0, dims[0]])
        .domain([0, xExtent[1]]);

      const y = scaleBand()
        .rangeRound([0, dims[1]])
        .padding(0.1)
        .domain(Object.keys(yDomain));

      return {
        data: data.map((d) => {
          return { udid: d.State, xVal: x(d[sortKey]), yVal: y(d.State) };
        }),
        x,
        y,
      };
    },
  );
};

export default makeGetSelectedData;
