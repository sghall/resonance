// @flow weak

import moment from 'moment';
import * as shape from 'd3-shape';
import { extent, merge, shuffle } from 'd3-array';
import { scaleUtc, scaleLinear } from 'd3-scale';
import { utcParse } from 'd3-time-format';
import { genRandomSeries } from 'docs/site/src/utils/helpers';
import { FRUITS } from './constants';

export function getInitialValues(days) {
  const data = shuffle(FRUITS).slice(0, 10);
  const time = moment();

  const dates = {};
  const names = {};

  for (let i = 0; i < data.length; i++) {
    const name = data[i].name;
    names[name] = genRandomSeries(days);
  }

  const items = [];

  for (let i = 0; i < days; i++) {
    const date = time.clone().subtract(i, 'days').toISOString();
    dates[date] = true;

    const item = { date };
    item.total = 0;

    for (let j = 0; j < data.length; j++) {
      const label = data[j].name;
      const value = Math.floor(names[label][i] * 1000);
      item[label] = value;
      item.total += value;
    }

    items.push(item);
  }

  return [
    items,
    Object.keys(names).sort().map((d) => ({ name: d, show: true })),
    Object.keys(dates).sort(),
  ];
}

function getPath(x, y, yVals, dates) {
  return shape.area()
    .x((d) => x(d))
    .y0((d, i) => y(yVals[i][0]))
    .y1((d, i) => y(yVals[i][1]))(dates);
}

export function getPathsAndScales(dims, data, names, dates, offset) {
  names = names.filter((d) => d.show === true).map((d) => d.name);
  dates = dates.map((d) => utcParse('%Y-%m-%dT%H:%M:%S.%LZ')(d));

  let layoutOffset = shape.stackOffsetNone;

  if (offset === 'stream') {
    layoutOffset = shape.stackOffsetSilhouette;
  } else if (offset === 'expand') {
    layoutOffset = shape.stackOffsetExpand;
  }

  const layout = shape.stack()
    .keys(names)
    .value((d, key) => d[key])
    .offset(layoutOffset)(data);

  const x = scaleUtc()
    .range([0, dims[0]])
    .domain([dates[0], dates[dates.length - 1]]);

  const y = scaleLinear()
    .range([dims[1], 0])
    .domain(extent(merge(merge(layout))));

  const paths = {};

  for (let k = 0; k < names.length; k++) {
    paths[names[k]] = getPath(x, y, layout[k], dates);
  }

  return [paths, x, y];
}
