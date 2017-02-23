// @flow weak
/* eslint global-require: "false" */

import { PropTypes } from 'react';

function BarCharts({ children }) {
  return children;
}

BarCharts.propTypes = {
  children: PropTypes.node,
};

export default (store, injectReducer) => ({
  nav: true,
  path: '/examples/bar-charts',
  title: 'Bar Charts',
  component: BarCharts,
  indexRoute: {
    onEnter(nextState, replace) {
      replace('/examples/bar-charts/states-by-age');
    },
  },
  childRoutes: [
    require('./routes/StatesByAge').default(store, injectReducer),
  ],
});

