// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import Title from 'react-title-component';
// import CodeExample from 'docs/src/components/CodeExample';
import MarkdownElement from 'docs/src/components/MarkdownElement';

// import Example1 from './Example1';
// import Example2 from './Example2';

const TickGroupDocs = (props) => {
  const { route: { docContext } } = props;

  return (
    <div>
      <Title render={(previousTitle) => `createTickGroup - ${previousTitle}`} />
      <MarkdownElement text={docContext('./createTickGroup/README.md')} />
    </div>
  );
};

TickGroupDocs.propTypes = {
  route: PropTypes.object.isRequired,
};

export default TickGroupDocs;
