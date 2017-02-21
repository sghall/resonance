// @flow weak

import React from 'react';
import {
  applyRouterMiddleware,
  hashHistory,
  Router,
  Route,
  IndexRoute,
  IndexRedirect,
} from 'react-router';
import { useScroll } from 'react-router-scroll';
import { kebabCase, titleize } from 'docs/site/src/utils/helpers';
import AppFrame from '../components/AppFrame';
import AppContent from '../components/AppContent';
import MarkdownDocs from '../components/MarkdownDocs';
import Home from '../pages/Home';

/**
 * This lets us eager load the files ahead of time
 * and require them dynamically with webpack's context feature
 */
const docsContext = require.context(
  './../../../../docs',
  true,
  /^((?![\\/]site\/src\/demos|node_modules[\\/]).)*\.md$/,
);

const apiDocRoutes = docsContext.keys()
  .filter((n) => /^\.\/api\//.test(n))
  .map((path) => {
    const name = path.replace(/.*\//, '').replace('.md', '');
    return (
      <Route
        key={name}
        title={name}
        path={`/component-api/${kebabCase(name)}`}
        content={docsContext(path)}
        component={MarkdownDocs}
        nav
      />
    );
  });

const demosContext = require.context('../demos', true, /\.md$/);
const demoRoutes = demosContext.keys()
  .map((path) => {
    const name = path.replace(/.*\//, '').replace('.md', '');
    return (
      <Route
        key={name}
        title={titleize(name)}
        path={`/component-demos/${name}`}
        content={demosContext(path)}
        component={MarkdownDocs}
        nav
      />
    );
  });

export default function AppRouter() {
  return (
    <Router
      history={hashHistory}
      render={applyRouterMiddleware(useScroll())}
    >
      <Route title="Material Charts" path="/" component={AppFrame}>
        <IndexRoute dockDrawer component={Home} title={null} />
        <Route
          title="Getting Started"
          path="/getting-started"
          component={AppContent}
          nav
        >
          <IndexRedirect to="installation" />
          <Route
            title="Installation"
            path="/getting-started/installation"
            content={docsContext('./getting-started/installation.md')}
            component={MarkdownDocs}
            nav
          />
          <Route
            title="Usage"
            path="/getting-started/usage"
            content={docsContext('./getting-started/usage.md')}
            component={MarkdownDocs}
            nav
          />
          <Route
            title="Server Rendering"
            path="/getting-started/server-rendering"
            content={docsContext('./getting-started/server-rendering.md')}
            component={MarkdownDocs}
            nav
          />
          <Route
            title="Examples"
            path="/getting-started/examples"
            content={docsContext('./getting-started/examples.md')}
            component={MarkdownDocs}
            nav
          />
        </Route>
        <Route
          title="Customization"
          path="/customization"
          nav
          component={AppContent}
        >
          <IndexRedirect to="themes" />
          <Route
            title="Themes"
            path="/customization/themes"
            content={docsContext('./customization/themes.md')}
            component={MarkdownDocs}
            nav
          />
          <Route
            title="Composition"
            path="/customization/composition"
            content={docsContext('./customization/composition.md')}
            component={MarkdownDocs}
            nav
          />
        </Route>
        <Route
          title="Style"
          path="/style"
          nav
          component={AppContent}
        >
          <Route
            title="Icons"
            path="/style/icons"
            content={docsContext('./site/src/pages/style/icons/icons.md')}
            component={MarkdownDocs}
            nav
          />
          <Route
            title="Typography"
            path="/style/typography"
            content={docsContext('./site/src/pages/style/typography/typography.md')}
            component={MarkdownDocs}
            nav
          />
        </Route>
        <Route
          title="Component Demos"
          path="/component-demos"
          nav
          component={AppContent}
        >
          {demoRoutes}
        </Route>
        <Route
          title="Component API"
          path="/component-api"
          nav
          component={AppContent}
        >
          {apiDocRoutes}
        </Route>
      </Route>
    </Router>
  );
}
