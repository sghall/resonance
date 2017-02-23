// @flow weak
/* eslint global-require: "false" */

import BarCharts from './components/BarCharts';

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

