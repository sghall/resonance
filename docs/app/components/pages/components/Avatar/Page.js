import React from 'react';
import Title from 'react-title-component';

import CodeExample from '../../../CodeExample';
import PropTypeDescription from '../../../PropTypeDescription';
import MarkdownElement from '../../../MarkdownElement';

import avatarReadmeText from './README.md';
import AvatarExampleSimple from './ExampleSimple';
import avatarExampleSimpleCode from '!raw-loader!./ExampleSimple';
import avatarCode from '!raw-loader!resonance/Surface/Surface';

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
