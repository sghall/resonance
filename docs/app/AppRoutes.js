// @flow weak

import React from 'react';
import {
  Route,
  Redirect,
  IndexRoute,
} from 'react-router';

// Here we define all our material-ui ReactComponents.
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

import Community from './components/pages/discover-more/Community';
import Contributing from './components/pages/discover-more/Contributing';
import RelatedProjects from './components/pages/discover-more/RelatedProjects';

/**
 * Routes: https://github.com/reactjs/react-router/blob/master/docs/API.md#route
 *
 * Routes are used to declare your view hierarchy.
 *
 * Say you go to http://material-ui.com/#/components/paper
 * The react router will search for a route named 'paper' and will recursively render its
 * handler and its parent handler like so: Paper > Components > Master
 */
const AppRoutes = (
  <Route path="/" component={Master}>
    <IndexRoute component={Home} />
    <Route path="home" component={Home} />
    <Redirect from="get-started" to="/get-started/required-knowledge" />
    <Route path="get-started">
      <Route path="required-knowledge" component={RequiredKnowledge} />
      <Route path="installation" component={Installation} />
      <Route path="usage" component={Usage} />
      <Route path="examples" component={Examples} />
      <Route path="server-rendering" component={ServerRendering} />
    </Route>
    <Redirect from="customization" to="/customization/themes" />
    <Route path="customization">
      <Route path="colors" component={Colors} />
      <Route path="themes" component={Themes} />
      <Route path="styles" component={Styles} />
    </Route>
    <Redirect from="components" to="/components/app-bar" />
    <Route path="components">
      <Route path="app-bar" component={AppBarPage} />
      <Route path="auto-complete" component={AutoCompletePage} />
      <Route path="avatar" component={AvatarPage} />
      <Route path="badge" component={BadgePage} />
    </Route>
    <Redirect from="discover-more" to="/discover-more/community" />
    <Route path="discover-more">
      <Route path="community" component={Community} />
      <Route path="contributing" component={Contributing} />
      <Route path="related-projects" component={RelatedProjects} />
    </Route>
  </Route>
);

export default AppRoutes;
