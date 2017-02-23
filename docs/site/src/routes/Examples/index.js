// @flow weak
// import Examples from './components/Examples';

export default (store) => ({
  nav: true,
  path: '/examples/home',
  title: 'Examples Home',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Examples = require('./components/Examples').default;
      cb(null, Examples);
    }, 'examples');
  },
  indexRoute: {
    onEnter(nextState, replace) {
      replace('/examples/home/bar-charts');
    },
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./routes/BarCharts').default(store),
      ]);
    });
  },
});

