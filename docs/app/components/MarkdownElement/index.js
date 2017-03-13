// @flow weak

import React, { Component, PropTypes } from 'react';
import marked from 'marked';

require('./github-markdown.css');

const styles = {
  root: {
    marginTop: 20,
    marginBottom: 20,
    padding: '0 10px',
  },
};

class MarkdownElement extends Component {
  static propTypes = {
    style: PropTypes.object,
    text: PropTypes.string.isRequired,
  };

  static defaultProps = {
    text: '',
  };

  componentWillMount() {
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: (code, lang) => {
        return require('highlight.js').highlight(lang, code).value; // eslint-disable-line
      },
    });
  }

  render() {
    const { style, text } = this.props;

    return (
      <div
        style={Object.assign({}, styles.root, style)}
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: marked(text) }} // eslint-disable-line react/no-danger
      />
    );
  }
}

export default MarkdownElement;
