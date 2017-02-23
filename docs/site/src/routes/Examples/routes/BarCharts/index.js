// @flow weak
// import Examples from './components/Examples';

export default (store) => ({
  nav: true,
  path: '/examples/home/bar-charts',
  title: 'Bar',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const BarCharts = require('./components/BarCharts').default;
      cb(null, BarCharts);
    }, 'bar-charts');
  },
});

