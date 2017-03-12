import React from 'react';
import Title from 'react-title-component';
import CodeExample from '../../../CodeExample';
import PropTypeDescription from '../../../PropTypeDescription';
import MarkdownElement from '../../../MarkdownElement';
import appBarReadmeText from './README.md';
import AppBarExampleIcon from './ExampleIcon';
import appBarExampleIconCode from '!raw-loader!./ExampleIcon';
import AppBarExampleIconButton from './ExampleIconButton';
import appBarExampleIconButtonCode from '!raw-loader!./ExampleIconButton';
import AppBarExampleComposition from './ExampleComposition';
import appBarExampleIconComposition from '!raw-loader!./ExampleComposition';
import appBarCode from '!raw-loader!resonance/Surface/Surface';

const AppBarPage = () => (
  <div>
    <Title render={(previousTitle) => `App Bar - ${previousTitle}`} />
    <MarkdownElement text={appBarReadmeText} />
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
