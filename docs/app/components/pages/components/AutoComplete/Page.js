import React from 'react';
import Title from 'react-title-component';

import CodeExample from '../../../CodeExample';
import PropTypeDescription from '../../../PropTypeDescription';
import MarkdownElement from '../../../MarkdownElement';

import autoCompleteReadmeText from './README.md';
import autoCompleteCode from '!raw-loader!resonance/Surface/Surface';
import AutoCompleteExampleSimple from './ExampleSimple';
import autoCompleteExampleSimpleCode from '!raw-loader!./ExampleSimple';
import AutoCompleteExampleDataSources from './ExampleDataSources';
import autoCompleteExampleDataSourcesCode from '!raw-loader!./ExampleDataSources';
import AutoCompleteExampleFilters from './ExampleFilters';
import autoCompleteExampleFiltersCode from '!raw-loader!./ExampleFilters';
import AutoCompleteExampleControlled from './ExampleControlled';
import autoCompleteExampleControlledCode from '!raw-loader!./ExampleControlled';

const AutoCompletesPage = () => (
  <div>
    <Title render={(previousTitle) => `Auto Complete - ${previousTitle}`} />
    <MarkdownElement text={autoCompleteReadmeText} />
    <CodeExample
      code={autoCompleteExampleSimpleCode}
      title="Simple example"
    >
      <AutoCompleteExampleSimple />
    </CodeExample>
    <CodeExample
      code={autoCompleteExampleDataSourcesCode}
      title="Data sources"
    >
      <AutoCompleteExampleDataSources />
    </CodeExample>
    <CodeExample
      code={autoCompleteExampleFiltersCode}
      title="Filters"
    >
      <AutoCompleteExampleFilters />
    </CodeExample>
    <CodeExample
      code={autoCompleteExampleControlledCode}
      title="Controlled example"
    >
      <AutoCompleteExampleControlled />
    </CodeExample>
    <PropTypeDescription code={autoCompleteCode} />
  </div>
);

export default AutoCompletesPage;
