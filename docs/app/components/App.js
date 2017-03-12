// Wait https://github.com/facebook/flow/issues/380 to be fixed
/* eslint-disable flowtype/require-valid-file-annotation */

import React from 'react';
import { connect } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createHashHistory } from 'history';
import routes from '../routes';

require('./bootstrap.grid.css');

injectTapEventPlugin();

function App() {
  return (
    <Router
      history={useRouterHistory(createHashHistory)()}
      onUpdate={() => window.scrollTo(0, 0)}
    >
      {routes}
    </Router>
  );
}

export default connect()(App);
