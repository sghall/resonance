// @flow weak

import React from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import Paper from 'material-ui/Paper';
import Layout from 'material-ui/Layout';

const styleSheet = createStyleSheet('Examples', (theme) => ({
  root: {
    flexGrow: 1,
    height: 400,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Examples(props, context) {
  const classes = context.styleManager.render(styleSheet);

  return (
    <div className={classes.root}>
      <Layout container gutter={24}>
        <Layout item xs={12}>
          <Paper className={classes.paper}>
            xs=12
          </Paper>
        </Layout>
      </Layout>
    </div>
  );
}

Examples.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};
