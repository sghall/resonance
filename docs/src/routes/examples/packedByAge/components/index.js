// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, TableRow, TableCell, TableBody } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Layout from 'material-ui/Layout';
import Paper from 'material-ui/Paper';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
import { updateSortOrder, makeGetSelectedData } from '../module';
import { VIEW, TRBL, AGES } from '../module/constants';
import Circle from './Circle';

export class Example extends Component {

  constructor(props) {
    super(props);

    (this:any).setDuration = this.setDuration.bind(this);
    (this:any).setShowTopN = this.setShowTopN.bind(this);
    (this:any).setActiveAgeGroup = this.setActiveAgeGroup.bind(this);
  }

  state = {
    duration: 750,
    showTopN: 20,
    activeAgeGroup: '5 to 13 Years',
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

  setActiveAgeGroup(group) {
    this.setState({ activeAgeGroup: group });
  }

  render() {
    const { sortKey, data, dispatch } = this.props;
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
          <Paper>
            <Table>
              <TableBody>
                {AGES.map((age) => {
                  const isSelected = age === sortKey;
                  return (
                    <TableRow
                      hover
                      onClick={() => dispatch(updateSortOrder(age))}
                      onMouseOver={() => this.setActiveAgeGroup(age)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex="-1"
                      key={age}
                      selected={isSelected}
                    >
                      <TableCell checkbox>
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell padding={false}>{age}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Layout>
        <Layout item xs={12} sm={8} md={9}>
          <Paper>
            <Surface view={VIEW} trbl={TRBL}>
              <NodeGroup
                data={data}
                duration={duration}
                keyAccessor={(d) => d.data.name}
                activeAgeGroup={this.state.activeAgeGroup}
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
