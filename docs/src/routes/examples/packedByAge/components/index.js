// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Layout from 'material-ui/Layout';
import Paper from 'material-ui/Paper';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
import { updateSortOrder, makeGetSelectedData } from '../module';
import { VIEW, TRBL } from '../module/constants';
import Circle from './Circle';
import Legend from './Legend';

const circleKeyAccessor = (d) => d.name;

export class Example extends Component {

  constructor(props) {
    super(props);

    (this:any).setSortKey = this.setSortKey.bind(this);
    (this:any).setDuration = this.setDuration.bind(this);
    (this:any).setShowTopN = this.setShowTopN.bind(this);
  }

  state = {
    duration: 500,
    showTopN: this.props.showTop,
  }

  setSortKey(sortKey) {
    const { dispatch } = this.props;
    dispatch(updateSortOrder(sortKey));
  }

  setDuration(e, value) {
    this.setState({
      duration: Math.floor(value * 10000),
    });
  }

  setShowTopN(e, value) {
    this.setState({
      showTopN: Math.floor(value * 20) + 5,
    });
  }

  render() {
    const { sortKey, data } = this.props;
    const { duration, showTopN } = this.state;

    return (
      <Layout container gutter={24}>
        <Layout item xs={12} sm={6}>
          <Paper>
            <span>Show Top {showTopN} States:</span>
          </Paper>
        </Layout>
        <Layout item xs={12} sm={6}>
          <Paper>
            <span>Transition Duration: {(duration / 1000).toFixed(1)} Seconds</span>
          </Paper>
        </Layout>
        <Layout item xs={12} sm={4} md={3}>
          <Legend
            sortKey={sortKey}
            setSortKey={this.setSortKey}
          />
        </Layout>
        <Layout item xs={12} sm={8} md={9}>
          <Paper>
            <Surface view={VIEW} trbl={TRBL}>
              <NodeGroup
                data={data}
                duration={duration}
                keyAccessor={circleKeyAccessor}
                sortKey={sortKey}
                nodeComponent={Circle}
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
  showTop: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
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
