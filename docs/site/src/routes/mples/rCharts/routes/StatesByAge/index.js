// @flow weak

export default (store, injectReducer) => ({
  nav: true,
  path: '/examples/bar-charts/states-by-age',
  title: 'States By Age',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'states-by-age', reducer: require('./module').default });
      cb(null, require('./components/StatesByAge').default);
    }, 'states-by-age');
  },
});

