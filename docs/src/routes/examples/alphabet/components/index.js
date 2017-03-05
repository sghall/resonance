// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Layout from 'material-ui/Layout';
import Paper from 'material-ui/Paper';
import Surface from 'resonance/Surface';
import { shuffle } from 'd3-array';
import { interval } from 'd3-timer';
import NodeGroup from 'resonance/NodeGroup';
import { VIEW, TRBL, ALPHABET } from '../module/constants';
import Text from './Text';
import { dataUpdate, makeGetSelectedData, dims } from '../module';

export class Example extends Component {

  componentDidMount() {
    const { props: { dispatch } } = this;

    interval(() => {
      dispatch(dataUpdate(shuffle(ALPHABET)
        .slice(0, Math.floor(Math.random() * 20))
        .sort()));
    }, 600);
  }

  render() {
    return (
      <Layout container gutter={24}>
        <Layout item xs={12}>
          <Paper style={{ padding: 10 }}>
            <h4>General Update Pattern</h4>
            <p>Adapted from the <a href="https://bl.ocks.org/mbostock/3808234">original example</a> from Mike Bostock</p>
          </Paper>
        </Layout>
        <Layout item xs={12}>
          <Paper>
            <Surface view={VIEW} trbl={TRBL}>
              <line stroke="white" x1={0} y1={dims[1] / 2} x2={dims[0]} y2={dims[1] / 2} />
              <NodeGroup
                data={this.props.data}
                keyAccessor={(d) => d.letter}
                nodeComponent={Text}
              />
            </Surface>
          </Paper>
        </Layout>
      </Layout>
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
