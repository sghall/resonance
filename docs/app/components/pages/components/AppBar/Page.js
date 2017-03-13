// @flow weak
/* eslint import/no-webpack-loader-syntax: 0 */

import React from 'react';
import Title from 'react-title-component';
import appBarCode from '!raw-loader!resonance/Surface/Surface';

import AppBarExampleComposition from './ExampleComposition';
import AppBarExampleIconButton from './ExampleIconButton';
import CodeExample from '../../../CodeExample';
import PropTypeDescription from '../../../PropTypeDescription';
import MarkdownElement from '../../../MarkdownElement';
import appBarReadmeText from './README.md';
import AppBarExampleIcon from './ExampleIcon';

const code = require.context('!raw-loader!./', false);

const AppBarPage = () => (
  <div>
    <Title render={(previousTitle) => `App Bar - ${previousTitle}`} />
    <MarkdownElement text={appBarReadmeText} />
    <CodeExample
      code={code('./ExampleIcon')}
      title="Simple example"
    >
      <AppBarExampleIcon />
    </CodeExample>
    <CodeExample
      code={code('./ExampleIconButton')}
      title="Buttons example"
    >
      <AppBarExampleIconButton />
    </CodeExample>
    <CodeExample
      code={code('./ExampleComposition')}
      title="Composition example"
    >
      <AppBarExampleComposition />
    </CodeExample>
    <PropTypeDescription
      code={appBarCode}
    />
  </div>
);

export default AppBarPage;
