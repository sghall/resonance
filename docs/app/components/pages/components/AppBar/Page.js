// @flow weak
/* eslint import/no-webpack-loader-syntax: 0 */

import React from 'react';
import Title from 'react-title-component';
import appBarExampleIconCode from '!raw-loader!./ExampleIcon';
import appBarExampleIconButtonCode from '!raw-loader!./ExampleIconButton';
import appBarExampleIconComposition from '!raw-loader!./ExampleComposition';
import appBarCode from '!raw-loader!resonance/Surface/Surface';
import AppBarExampleComposition from './ExampleComposition';
import AppBarExampleIconButton from './ExampleIconButton';
import CodeExample from '../../../CodeExample';
import PropTypeDescription from '../../../PropTypeDescription';
import MarkdownElement from '../../../MarkdownElement';
import appBarReadmeText from './README.md';
import AppBarExampleIcon from './ExampleIcon';
import Surface from 'resonance/Surface';

const js = require.context('./', false);
console.log(js.keys());

const AppBarPage = () => (
  <div>
    <Title render={(previousTitle) => `App Bar - ${previousTitle}`} />
    <MarkdownElement text={appBarReadmeText} />
    <Surface style={{ backgroundColor: 'grey' }} />
    <CodeExample
      code={appBarExampleIconCode}
      title="Simple example"
    >
      <AppBarExampleIcon />
    </CodeExample>
    <CodeExample
      code={appBarExampleIconButtonCode}
      title="Buttons example"
    >
      <AppBarExampleIconButton />
    </CodeExample>
    <CodeExample
      code={appBarExampleIconComposition}
      title="Composition example"
    >
      <AppBarExampleComposition />
    </CodeExample>
    <PropTypeDescription code={appBarCode} />
  </div>
);

export default AppBarPage;
