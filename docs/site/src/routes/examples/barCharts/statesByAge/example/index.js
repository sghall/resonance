// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, TableRow, TableCell, TableBody } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Layout from 'material-ui/Layout';
import Chart from 'material-charts/Chart';
import Paper from 'material-ui/Paper';
import withManagedData from 'material-charts/withManagedData';
import { updateSortOrder, makeGetSelectedData } from '../modules';
import { VIEW, TRBL, AGES } from '../modules/constants';
import Axis from './components/TickGroup';
import Bar from './components/Bar';

const ManagedBars = withManagedData(Bar);

export class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      duration: 1000,
      showTopN: 20,
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
    const { sortKey, data, xScale, yScale, dispatch } = this.props;
    const { duration, showTopN } = this.state;

    const barNodes = (
      <ManagedBars
        data={data}
        xScale={xScale}
        yScale={yScale}
        duration={duration}
      />
    );

    const tableRows = AGES.map((age) => {
      const isSelected = age === sortKey;

      return (
        <TableRow
          hover
          onClick={() => dispatch(updateSortOrder(age))}
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
    });

    let axis = null;

    if (xScale.ticks && yScale.range) {
      axis = (
        <Axis
          xScale={xScale}
          yScale={yScale}
          duration={duration}
        />
      );
    }

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
                {tableRows}
              </TableBody>
            </Table>
          </Paper>
        </Layout>
        <Layout item xs={12} sm={8} md={9}>
          <Paper>
            <Chart view={VIEW} trbl={TRBL}>
              {barNodes}{axis}
            </Chart>
          </Paper>
        </Layout>
      </Layout>
    );
  }
}

App.propTypes = {
  data: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
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


export default connect(makeMapStateToProps())(App);
