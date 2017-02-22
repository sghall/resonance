// @flow weak
/* eslint global-require: "true" */

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
import courseRoutes from './Course';

/**
 * This lets us eager load the files ahead of time
 * and require them dynamically with webpack's context feature
 */

function formatName(path) {
  return [path, path.replace(/.*\//, '').replace('.md', '')];
}

const demosContext = require.context('../demos', true, /\.md$/);
const demoRoutes = demosContext.keys()
  .map(formatName)
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
  .map(formatName)
  .map(([path, name]) => {
    return {
      nav: true,
      path: `/component-api/${kebabCase(name)}`,
      title: name,
      component: MarkdownDocs,
      content: docsContext(path),
    };
  });

const rootRoute = {
  childRoutes: [{
    path: '/',
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
        childRoutes: [
          {
            nav: true,
            path: '/getting-started/installation',
            title: 'Installation',
            component: MarkdownDocs,
            content: docsContext('./getting-started/installation.md'),
          },
          {
            nav: true,
            path: '/getting-started/usage',
            title: 'Usage',
            component: MarkdownDocs,
            content: docsContext('./getting-started/usage.md'),
          },
          {
            nav: true,
            path: '/getting-started/server-rendering',
            title: 'Server Rendering',
            component: MarkdownDocs,
            content: docsContext('./getting-started/server-rendering.md'),
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
    ],
  }],
};

export default function AppRouter() {
  return (
    <Router
      history={hashHistory}
      render={applyRouterMiddleware(useScroll())}
      routes={rootRoute}
    />
  );
}

// const docsContext = require.context(
//   './../../../../docs',
//   true,
//   /^((?![\\/]site\/src\/demos|node_modules[\\/]).)*\.md$/,
// );

// const apiDocRoutes = docsContext.keys()
//   .filter((n) => /^\.\/api\//.test(n))
//   .map((path) => {
//     const name = path.replace(/.*\//, '').replace('.md', '');
//     return (
//       <Route
//         key={name}
//         title={name}
//         path={`/component-api/${kebabCase(name)}`}
//         content={docsContext(path)}
//         component={MarkdownDocs}
//         nav
//       />
//     );
//   });

// const demosContext = require.context('../demos', true, /\.md$/);
// const demoRoutes = demosContext.keys()
//   .map((path) => {
//     const name = path.replace(/.*\//, '').replace('.md', '');
//     return (
//       <Route
//         key={name}
//         title={titleize(name)}
//         path={`/component-demos/${name}`}
//         content={demosContext(path)}
//         component={MarkdownDocs}
//         nav
//       />
//     );
//   });

// export default function AppRouter() {
//   return (
//     <Router
//       history={hashHistory}
//       render={applyRouterMiddleware(useScroll())}
//     >
//       <Route title="Material Charts" path="/" component={AppFrame}>
//         <IndexRoute dockDrawer component={Home} title={null} />
//         <Route
//           title="Getting Started"
//           path="/getting-started"
//           component={AppContent}
//           nav
//         >
//           <IndexRedirect to="installation" />
//           <Route
//             title="Installation"
//             path="/getting-started/installation"
//             content={docsContext('./getting-started/installation.md')}
//             component={MarkdownDocs}
//             nav
//           />
//           <Route
//             title="Usage"
//             path="/getting-started/usage"
//             content={docsContext('./getting-started/usage.md')}
//             component={MarkdownDocs}
//             nav
//           />
//           <Route
//             title="Server Rendering"
//             path="/getting-started/server-rendering"
//             content={docsContext('./getting-started/server-rendering.md')}
//             component={MarkdownDocs}
//             nav
//           />
//           <Route
//             title="Examples"
//             path="/getting-started/examples"
//             content={docsContext('./getting-started/examples.md')}
//             component={MarkdownDocs}
//             nav
//           />
//         </Route>
//         <Route
//           title="Customization"
//           path="/customization"
//           component={AppContent}
//           nav
//         >
//           <IndexRedirect to="themes" />
//           <Route
//             title="Themes"
//             path="/customization/themes"
//             content={docsContext('./customization/themes.md')}
//             component={MarkdownDocs}
//             nav
//           />
//           <Route
//             title="Composition"
//             path="/customization/composition"
//             content={docsContext('./customization/composition.md')}
//             component={MarkdownDocs}
//             nav
//           />
//         </Route>
//         <Route
//           title="Style"
//           path="/style"
//           component={AppContent}
//           nav
//         >
//           <Route
//             title="Icons"
//             path="/style/icons"
//             content={docsContext('./site/src/pages/style/icons/icons.md')}
//             component={MarkdownDocs}
//             nav
//           />
//           <Route
//             title="Typography"
//             path="/style/typography"
//             content={docsContext('./site/src/pages/style/typography/typography.md')}
//             component={MarkdownDocs}
//             nav
//           />
//         </Route>
//         <Route
//           title="Examples"
//           path="/examples"
//           component={AppContent}
//           nav
//         >
//           <Route
//             title="Icons"
//             path="/style/icons"
//             content={docsContext('./site/src/pages/style/icons/icons.md')}
//             component={MarkdownDocs}
//             nav
//           />
//           <Route
//             title="Typography"
//             path="/style/typography"
//             content={docsContext('./site/src/pages/style/typography/typography.md')}
//             component={MarkdownDocs}
//             nav
//           />
//         </Route>
//         <Route
//           title="Component Demos"
//           path="/component-demos"
//           component={AppContent}
//           nav
//         >
//           {demoRoutes}
//         </Route>
//         <Route
//           title="Component API"
//           path="/component-api"
//           component={AppContent}
//           nav
//         >
//           {apiDocRoutes}
//         </Route>
//       </Route>
//     </Router>
//   );
// }
