// @flow weak
import BarCharts from './components/BarCharts';

export default (store) => ({
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
    require('./routes/StatesByAge').default(store), // eslint-disable-line global-require
  ],
});

