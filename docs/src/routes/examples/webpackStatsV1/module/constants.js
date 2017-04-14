// @flow weak

export const EXAMPLE_STORE_KEY = 'webpack-stats-v1';

export const VIEW = [500, 500];        // ViewBox: Width, Height
export const TRBL = [75, 75, 75, 75];  // Margins: Top, Right, Bottom, Left

export const DIMS = [
  VIEW[0] - TRBL[1] - TRBL[3],  // Usable dimensions width
  VIEW[1] - TRBL[0] - TRBL[2],  // Usable dimensions height
];

export const COLORS = [
  '#12291F',
  '#3C564B',
  '#091F16',
  '#02130C',
  '#121E26',
  '#3A4751',
  '#1E272E',
  '#0A151D',
  '#030C12',
  '#253517',
  '#5D704E',
  '#324027',
  '#19280C',
  '#0D1903',
];
