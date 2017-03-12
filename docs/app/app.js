// @flow weak

import React from 'react';
import { render } from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createHashHistory } from 'history';
import AppRoutes from './AppRoutes';

window.React = React;
window.Perf = require('react-addons-perf');

injectTapEventPlugin();

render(
  <Router
    history={useRouterHistory(createHashHistory)()}
    onUpdate={() => window.scrollTo(0, 0)}
  >
    {AppRoutes}
  </Router>
, document.getElementById('app'));
