// @flow weak

export default (store, injectReducer) => ({
  nav: true,
  path: '/examples/bar-charts/states-by-age',
  title: 'States By Age',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Example = require('./example').default;
      const reducer = require('./modules').default;

      injectReducer(store, { key: 'states-by-age', reducer });
      cb(null, Example);
    }, 'states-by-age');
  },
});
