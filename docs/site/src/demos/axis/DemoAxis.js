// @flow weak

import React from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import Axis from 'material-charts/Axis';
import Text from 'material-ui/Text';

const styleSheet = createStyleSheet('PaperSheet', (theme) => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
  }),
}));

export default function PaperSheet(props, context) {
  const classes = context.styleManager.render(styleSheet);

  return (
    <div>
      <Axis className={classes.root} zDepth={4}>
        <Text type="headline" component="h3">
          This is a sheet of paper.
        </Text>
        <Text type="body1" component="p">
          Paper can be used to build surface or other elements for your application.
        </Text>
      </Axis>
    </div>
  );
}

PaperSheet.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};
