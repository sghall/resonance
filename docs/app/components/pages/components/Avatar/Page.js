// @flow weak
/* eslint import/no-webpack-loader-syntax: 0 */

import React from 'react';
import Title from 'react-title-component';

import avatarExampleSimpleCode from '!raw-loader!./ExampleSimple';
import avatarCode from '!raw-loader!resonance/Surface/Surface';

import CodeExample from '../../../CodeExample';
import MarkdownElement from '../../../MarkdownElement';
import PropTypeDescription from '../../../PropTypeDescription';

import avatarReadmeText from './README.md';
import AvatarExampleSimple from './ExampleSimple';

const AvatarsPage = () => (
  <div>
    <Title render={(previousTitle) => `Avatar - ${previousTitle}`} />
    <MarkdownElement text={avatarReadmeText} />
    <CodeExample
      code={avatarExampleSimpleCode}
      title="Examples"
    >
      <AvatarExampleSimple />
    </CodeExample>
    <PropTypeDescription code={avatarCode} />
  </div>
);

export default AvatarsPage;
