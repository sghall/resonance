// @flow weak
/* eslint global-require: "false" */

import React from 'react';
import {
  applyRouterMiddleware,
  hashHistory,
  Router,
} from 'react-router';
import { useScroll } from 'react-router-scroll';
import { kebabCase, titleize } from 'docs/site/src/utils/helpers';
import AppFrame from '../components/AppFrame';
import AppContent from '../components/AppContent';
import MarkdownDocs from '../components/MarkdownDocs';
import Home from './Home';
import store, { injectReducer } from '../store';

function formatPath(path) {
  return [path, path.replace(/.*\//, '').replace('.md', '')];
}

const demosContext = require.context('../demos', true, /\.md$/);
const demoRoutes = demosContext.keys()
  .map(formatPath)
  .map(([path, name]) => {
    return {
      nav: true,
      path: `/component-demos/${name}`,
      title: titleize(name),
      component: MarkdownDocs,
      content: demosContext(path),
    };
  });

const docsContext = require.context(
  './../../../../docs',
  true,
  /^((?![\\/]site\/src\/demos|node_modules[\\/]).)*\.md$/,
);

const apiDocRoutes = docsContext.keys()
  .filter((n) => /^\.\/api\//.test(n))
  .map(formatPath)
  .map(([path, name]) => {
    return {
      nav: true,
      path: `/component-api/${kebabCase(name)}`,
      title: name,
      component: MarkdownDocs,
      content: docsContext(path),
    };
  });

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
      nav: true,
      path: '/getting-started',
      title: 'Getting Started',
      component: AppContent,
      indexRoute: {
        onEnter(nextState, replace) {
          replace('/getting-started/installation');
        },
      },
      childRoutes: [
        {
          nav: true,
          path: '/getting-started/installation',
          title: 'Installation',
          component: MarkdownDocs,
          content: docsContext('./site/src/routes/getting-started/installation.md'),
        },
        {
          nav: true,
          path: '/getting-started/examples',
          title: 'Examples',
          component: MarkdownDocs,
          content: docsContext('./site/src/routes/getting-started/examples.md'),
        },
        {
          nav: true,
          path: '/getting-started/usage',
          title: 'Usage',
          component: MarkdownDocs,
          content: docsContext('./site/src/routes/getting-started/usage.md'),
        },
        {
          nav: true,
          path: '/getting-started/server-rendering',
          title: 'Server Rendering',
          component: MarkdownDocs,
          content: docsContext('./site/src/routes/getting-started/server-rendering.md'),
        },
      ],
    },
    {
      nav: true,
      path: '/component-demos',
      title: 'Component Demos',
      component: AppContent,
      childRoutes: demoRoutes,
    },
    {
      nav: true,
      path: '/component-api',
      title: 'Component API',
      component: AppContent,
      childRoutes: apiDocRoutes,
    },
    {
      nav: true,
      path: '/examples',
      title: 'Examples',
      component: AppContent,
      indexRoute: {
        onEnter(nextState, replace) {
          replace('/examples/states-by-age');
        },
      },
      childRoutes: [
        require('./examples/statesByAge').default(store, injectReducer),
        require('./examples/stackedArea').default(store, injectReducer),
      ],
    },
  ],
};

export default function AppRouter() {
  return (
    <Router
      history={hashHistory}
      render={applyRouterMiddleware(useScroll())}
      routes={routes}
    />
  );
}
