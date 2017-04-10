// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import Title from 'react-title-component';
// import CodeExample from 'docs/src/components/CodeExample';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import PropTypeDescription from 'docs/src/components/PropTypeDescription';

// import Example1 from './Example1';
// import Example2 from './Example2';

const TickGroupDocs = (props) => {
  const { route: { docContext, srcContext } } = props;

  return (
    <div>
      <Title render={(previousTitle) => `TickGroup - ${previousTitle}`} />
      <MarkdownElement text={docContext('./TickGroup/README.md')} />
      <PropTypeDescription code={srcContext('./TickGroup/TickGroup')} />
    </div>
  );
};

TickGroupDocs.propTypes = {
  route: PropTypes.object.isRequired,
};

export default TickGroupDocs;
