// @flow weak
/* eslint global-require: 0 */

import Home from './Home';
import AppFrame from '../components/AppFrame';
import createNodeGroupDocs from './documentation/NodeGroup';
import createTickGroupDocs from './documentation/TickGroup';
import store, { injectReducer } from '../store';

const docContext = require.context('!raw-loader!./documentation', true);
const srcContext = require.context('!raw-loader!../../../src', true);

const routes = {
  path: '/',
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
          replace('/documentation/node-group');
        },
      },
      childRoutes: [
        {
          path: '/documentation/node-group',
          docContext,
          srcContext,
          component: createNodeGroupDocs,
        },
        {
          path: '/documentation/tick-group',
          docContext,
          srcContext,
          component: createTickGroupDocs,
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
        require('./examples/statesByAge').default(store, injectReducer),
        require('./examples/packedByAge').default(store, injectReducer),
        require('./examples/stackedArea').default(store, injectReducer),
        require('./examples/alluvialChart').default(store, injectReducer),
        require('./examples/webpackSunburst').default(store, injectReducer),
      ],
    },
  ],
};

export default routes;
