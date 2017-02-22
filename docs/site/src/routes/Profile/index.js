// @flow weak

const route = {
  path: 'profile',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Profile'));
    });
  },
};

export default route;
