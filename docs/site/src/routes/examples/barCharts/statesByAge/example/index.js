// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, TableRow, TableCell, TableBody } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Layout from 'material-ui/Layout';
import Chart from 'material-charts/Chart';
import Paper from 'material-ui/Paper';
import { updateSortOrder, removedNode } from '../modules';
import makeGetSelectedData from '../modules/selectors';
import withSelection from './components/withSelection';
import Axis from './components/TickGroup';
import Bar from './components/Bar';

const ManagedBars = withSelection(Bar);

const ages = [
  'Under 5 Years',
  '5 to 13 Years',
  '14 to 17 Years',
  '18 to 24 Years',
  '16 Years and Over',
  '18 Years and Over',
  '15 to 44 Years',
  '45 to 64 Years',
  '65 Years and Over',
  '85 Years and Over',
];

export class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      duration: 1000,
      showTopN: 20,
    };

    this.removeItem = this.removeItem.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.setShowTopN = this.setShowTopN.bind(this);
  }

  componentDidMount() {
    const { dispatch, sortKey } = this.props;
    dispatch(updateSortOrder(sortKey));
  }

  removeItem(key) {
    const { dispatch } = this.props;
    dispatch(removedNode(key));
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
    const { data, x, y, view, trbl, dispatch, sortKey } = this.props;
    const { duration, showTopN } = this.state;

    const barNodes = (
      <ManagedBars
        data={data}
        xScale={x}
        yScale={y}
        duration={duration}
      />
    );

    const tableRows = ages.map((age) => {
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

    if (x.ticks && y.range) {
      axis = (
        <Axis
          xScale={x}
          yScale={y}
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
            <Chart view={view} trbl={trbl}>
              {barNodes}{axis}
            </Chart>
          </Paper>
        </Layout>
      </Layout>
    );
  }
}

App.propTypes = {
  view: PropTypes.array.isRequired,
  trbl: PropTypes.array.isRequired,
  sortKey: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const getSelectedData = makeGetSelectedData();
  const mapStateToProps = (state) => {
    const { view, trbl, sortKey } = state['states-by-age'];
    const { data, y, x } = getSelectedData(state);
    return { data, x, y, view, trbl, sortKey };
  };
  return mapStateToProps;
};


export default connect(makeMapStateToProps())(App);
