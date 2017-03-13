// @flow weak
/* eslint global-require: 0 */

import Home from './Home';
import AppFrame from '../components/AppFrame';
import BadgePage from './documentation/Badge/Page';
import AppBarPage from './documentation/AppBar/Page';
import AvatarPage from './documentation/Avatar/Page';
import AutoCompletePage from './documentation/AutoComplete/Page';
import store, { injectReducer } from '../store';

const routes = {
  path: '/',
  title: 'Material Charts',
  component: AppFrame,
  indexRoute: {
    title: null,
    component: Home,
    dockDrawer: true,
  },
  childRoutes: [
    {
      path: 'documentation',
      indexRoute: {
        onEnter(nextState, replace) {
          replace('/documentation/app-bar');
        },
      },
      childRoutes: [
        {
          path: '/documentation/app-bar',
          component: AppBarPage,
        },
        {
          path: '/documentation/auto-complete',
          component: AutoCompletePage,
        },
        {
          path: '/documentation/avatar',
          component: AvatarPage,
        },
        {
          path: '/documentation/badge',
          component: BadgePage,
        },
      ],
    },
    {
      path: 'examples',
      indexRoute: {
        onEnter(nextState, replace) {
          replace('/examples/alphabet');
        },
      },
      childRoutes: [
        require('./examples/alphabet').default(store, injectReducer),
        // require('./examples/packedByAge').default(store, injectReducer),
        require('./examples/statesByAge').default(store, injectReducer),
        // require('./examples/stackedArea').default(store, injectReducer),
      ],
    },
  ],
};

export default routes;
