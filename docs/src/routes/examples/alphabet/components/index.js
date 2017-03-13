// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Title from 'react-title-component';
import Surface from 'resonance/Surface';
import { shuffle } from 'd3-array';
import { interval } from 'd3-timer';
import NodeGroup from 'resonance/NodeGroup';
import MarkdownElement from 'docs/app/components/MarkdownElement';
import { VIEW, TRBL, ALPHABET, BASE_DURATION } from '../module/constants';
import Text from './Text';
import { dataUpdate, makeGetSelectedData, dims } from '../module';

export class Example extends Component {

  componentDidMount() {
    const { props: { dispatch } } = this;

    this.loop = interval(() => {
      dispatch(dataUpdate(shuffle(ALPHABET)
        .slice(0, Math.floor(Math.random() * 26))
        .sort()));
    }, BASE_DURATION * 1.5);
  }

  componentWillUnmount() {
    this.loop.stop();
  }

  loop = null // interval set on mount

  render() {
    return (
      <div>
        <Title render={(previousTitle) => `App Bar - ${previousTitle}`} />
        <MarkdownElement text={'the markdown text'} />
        <Surface view={VIEW} trbl={TRBL}>
          <line stroke="grey" x1={0} y1={dims[1] / 2} x2={dims[0]} y2={dims[1] / 2} />
          <NodeGroup
            data={this.props.data}
            keyAccessor={(d) => d.letter}
            nodeComponent={Text}
          />
        </Surface>
      </div>
    );
  }
}

Example.propTypes = {
  data: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const getSelectedData = makeGetSelectedData();
  const mapStateToProps = (state) => {
    return getSelectedData(state);
  };
  return mapStateToProps;
};


export default connect(makeMapStateToProps())(Example);
