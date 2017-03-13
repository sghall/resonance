// @flow weak
/* eslint import/no-webpack-loader-syntax: 0 */

import React from 'react';
import Title from 'react-title-component';

import badgeExampleSimpleCode from '!raw-loader!./ExampleSimple';
import badgeExampleContentCode from '!raw-loader!./ExampleContent';
import badgeCode from '!raw-loader!resonance/Surface/Surface';

import BadgeExampleContent from './ExampleContent';
import CodeExample from '../../../components/CodeExample';
import PropTypeDescription from '../../../components/PropTypeDescription';
import MarkdownElement from '../../../components/MarkdownElement';

import badgeReadmeText from './README.md';
import BadgeExampleSimple from './ExampleSimple';

const descriptions = {
  simple: 'Two examples of badges containing text, using primary and secondary colors. ' +
  'The badge is applied to its children - an icon for the first example, and an ' +
  '[Icon Button](/#/components/icon-button) with tooltip for the second.',
  further: 'Badges containing an [Icon Button](/#/components/icon-button) and text, ' +
  'applied to an icon, and text.',

};

const BadgePage = () => (
  <div>
    <Title render={(previousTitle) => `Badge - ${previousTitle}`} />
    <MarkdownElement text={badgeReadmeText} />
    <CodeExample
      title="Simple examples"
      description={descriptions.simple}
      code={badgeExampleSimpleCode}
    >
      <BadgeExampleSimple />
    </CodeExample>
    <CodeExample
      title="Further examples"
      description={descriptions.further}
      code={badgeExampleContentCode}
    >
      <BadgeExampleContent />
    </CodeExample>
    <PropTypeDescription code={badgeCode} />
  </div>
);

export default BadgePage;
