// @flow weak

import { EXAMPLE_STORE_KEY } from './module/constants';

export default (store, injectReducer) => ({
  path: `/examples/${EXAMPLE_STORE_KEY}`,
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Example = require('./components').default;
      const reducer = require('./module').default;

      injectReducer(store, { key: EXAMPLE_STORE_KEY, reducer });
      cb(null, Example);
    });
  },
});
