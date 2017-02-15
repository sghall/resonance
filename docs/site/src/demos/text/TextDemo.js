// @flow weak
import React from 'react';
import customPropTypes from 'material-ui/utils/customPropTypes';
import Chart from 'material-charts/Chart';
import Text from 'material-charts/Text';

export default function TextDemo() {
  return (
    <Chart>
      <Text y={15} textType="headline">
        Headline
      </Text>
      <Text y={30} textType="subheading" textFill="secondary">
        Sub-Heading
      </Text>
      <Text y={50} textType="body1">
        Some body1 text using the the primary fill.
      </Text>
      <Text y={65} textType="body1" textFill="secondary">
        Some body1 text using the the secondary fill.
      </Text>
      <Text y={80} textType="body2">
        Some body1 text using the the primary fill.
      </Text>
      <Text y={95} textType="body2" textFill="secondary">
        Some body1 text using the the secondary fill.
      </Text>
      <Text y={135} textType="body2" style={{ fill: 'steelblue' }}>
        A <tspan fill="tomato" fontSize={20}>{'"tspan"'}</tspan> and custom text fill.
      </Text>
    </Chart>
  );
}

TextDemo.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};
