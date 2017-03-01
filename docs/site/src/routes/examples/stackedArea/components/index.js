// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, TableRow, TableCell, TableBody } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Layout from 'material-ui/Layout';
import Paper from 'material-ui/Paper';
import Chart from 'material-charts/Chart';
import Axis from 'material-charts/Axis';
import { toggleFilter, makeGetSelectedData } from '../modules';
import { VIEW, TRBL } from '../modules/constants';
import ManagedPaths from './ManagedPaths';

export class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      duration: 1000,
    };

    this.setDuration = this.setDuration.bind(this);
    this.setShowTopN = this.setShowTopN.bind(this);
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
    const { filter, offset, paths, xScale, yScale, dispatch } = this.props;
    const { duration } = this.state;

    return (
      <Layout container gutter={24}>
        <Layout item xs={12} sm={6}>
          <Paper>
            Offset
          </Paper>
        </Layout>
        <Layout item xs={12} sm={6}>
          <Paper>
            Duration
          </Paper>
        </Layout>
        <Layout item xs={12} sm={4} md={3}>
          <Paper>
            <Table>
              <TableBody>
                {filter.map((d, i) => {
                  const isSelected = d.show;
                  return (
                    <TableRow
                      hover
                      onClick={() => dispatch(toggleFilter(i))}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex="-1"
                      key={d.name}
                      selected={isSelected}
                    >
                      <TableCell checkbox>
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell padding={false}>{d.name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Layout>
        <Layout item xs={12} sm={8} md={9}>
          <Paper>
            <Chart view={VIEW} trbl={TRBL}>
              <ManagedPaths
                data={paths}
                xScale={xScale}
                yScale={yScale}
                duration={duration}
                keyAccessor={(d) => d.name}
              />
            </Chart>
          </Paper>
        </Layout>
      </Layout>
    );
  }
}

App.propTypes = {
  paths: PropTypes.array.isRequired,
  filter: PropTypes.array.isRequired,
  offset: PropTypes.string.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const getSelectedData = makeGetSelectedData();
  const mapStateToProps = (state) => {
    return getSelectedData(state);
  };
  return mapStateToProps;
};


export default connect(makeMapStateToProps())(App);
