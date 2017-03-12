// @flow weak

import Master from './components/Master';
import Home from './components/pages/Home';

import RequiredKnowledge from './components/pages/get-started/RequiredKnowledge';
import Installation from './components/pages/get-started/Installation';
import Usage from './components/pages/get-started/Usage';
import Examples from './components/pages/get-started/Examples';
import ServerRendering from './components/pages/get-started/ServerRendering';

import Colors from './components/pages/customization/Colors';
import Themes from './components/pages/customization/Themes';
import Styles from './components/pages/customization/Styles';

import AppBarPage from './components/pages/components/AppBar/Page';
import AutoCompletePage from './components/pages/components/AutoComplete/Page';
import AvatarPage from './components/pages/components/Avatar/Page';
import BadgePage from './components/pages/components/Badge/Page';

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
      path: 'get-started',
      indexRoute: {
        onEnter(nextState, replace) {
          replace('/get-started/installation');
        },
      },
      childRoutes: [
        {
          path: '/get-started/required-knowledge',
          component: RequiredKnowledge,
        },
        {
          path: '/get-started/installation',
          component: Installation,
        },
        {
          path: '/get-started/usage',
          component: Usage,
        },
        {
          path: '/get-started/examples',
          component: Examples,
        },
        {
          path: '/get-started/server-rendering',
          component: ServerRendering,
        },
      ],
    },
    {
      path: 'customization',
      indexRoute: {
        onEnter(nextState, replace) {
          replace('/customization/themes');
        },
      },
      childRoutes: [
        {
          path: '/customization/colors',
          component: Colors,
        },
        {
          path: '/customization/themes',
          component: Themes,
        },
        {
          path: '/customization/styles',
          component: Styles,
        },
      ],
    },
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
  ],
};

export default routes;
