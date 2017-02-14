// @flow weak
import React from 'react';
import customPropTypes from 'material-ui/utils/customPropTypes';
import Chart from 'material-charts/Chart';
import Text from 'material-ui/Text';

export default function DemoChart() {
  return (
    <Chart>
      <Text type="headline" component="h3">
        This is a sheet of paper.
      </Text>
      <Text type="body1" component="p">
        Paper can be used to build surface or other elements for your application.
      </Text>
    </Chart>
  );
}

DemoChart.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};
