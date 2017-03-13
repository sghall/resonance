// @flow weak
/* eslint global-require: 0 */

import Master from '../components/Master';
import Home from './Home';

import AppBarPage from './components/AppBar/Page';
import AutoCompletePage from './components/AutoComplete/Page';
import AvatarPage from './components/Avatar/Page';
import BadgePage from './components/Badge/Page';

import store, { injectReducer } from '../store';

const routes = {
  path: '/',
  title: 'Material Charts',
  component: Master,
  indexRoute: {
    title: null,
    component: Home,
    dockDrawer: true,
  },
  childRoutes: [
    {
      path: 'components',
      indexRoute: {
        onEnter(nextState, replace) {
          replace('/components/app-bar');
        },
      },
      childRoutes: [
        {
          path: '/components/app-bar',
          component: AppBarPage,
        },
        {
          path: '/components/auto-complete',
          component: AutoCompletePage,
        },
        {
          path: '/components/avatar',
          component: AvatarPage,
        },
        {
          path: '/components/badge',
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
