// @flow weak

import React, { Component, PropTypes } from 'react';
import Title from 'react-title-component';
// import CodeExample from 'docs/src/components/CodeExample';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import PropTypeDescription from 'docs/src/components/PropTypeDescription';

// import AppBarExampleIcon from './ExampleIcon';
// import AppBarExampleIconButton from './ExampleIconButton';
// import AppBarExampleComposition from './ExampleComposition';

class SurfaceDocs extends Component {
  static propTypes = {
    route: PropTypes.object.isRequired,
  }

  // render() {
  //   const { route: { docContext, srcContext } } = this.props;

  //   return (
  //     <div>
  //       <Title render={(previousTitle) => `TickGroup - ${previousTitle}`} />
  //       <MarkdownElement text={docContext('./TickGroup/README.md')} />
  //       <CodeExample
  //         code={docContext('./TickGroup/ExampleIcon')}
  //         title="Simple example"
  //       >
  //         <AppBarExampleIcon />
  //       </CodeExample>
  //       <CodeExample
  //         code={docContext('./TickGroup/ExampleIconButton')}
  //         title="Buttons example"
  //       >
  //         <AppBarExampleIconButton />
  //       </CodeExample>
  //       <CodeExample
  //         code={docContext('./TickGroup/ExampleComposition')}
  //         title="Composition example"
  //       >
  //         <AppBarExampleComposition />
  //       </CodeExample>
  //       <PropTypeDescription code={srcContext('./TickGroup/TickGroup')} />
  //     </div>
  //   );
  // }

  render() {
    const { route: { docContext, srcContext } } = this.props;

    return (
      <div>
        <Title render={(previousTitle) => `TickGroup - ${previousTitle}`} />
        <MarkdownElement text={docContext('./TickGroup/README.md')} />
        <PropTypeDescription code={srcContext('./TickGroup/TickGroup')} />
      </div>
    );
  }
}

export default SurfaceDocs;
