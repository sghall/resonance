// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, TableRow, TableRowColumn, TableBody } from 'material-ui/Table';
import { Card, CardHeader } from 'material-ui/Card';
import { format } from 'd3-format';
import { updateSortOrder, removedNode } from '../modules';
import { Chart } from './components/Chart';
import { Axis } from './components/Axis';
import { Bar } from './components/Bar';

const percentFormat = format('.1%');

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
      showTopN: 10,
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
    const { view, trbl, mounted, dispatch, sortKey, xScale, yScale } = this.props;
    const { duration, showTopN } = this.state;

    const barNodes = Object.keys(mounted).map((key) => {
      const node = mounted[key];
      return (
        <Bar
          key={key}
          node={node}
          xScale={xScale}
          yScale={yScale}
          duration={duration}
          removeNode={this.removeItem}
        />
      );
    });

    // const tableRows = ages.map((age) => {
    //   return (
    //     <TableRow
    //       key={age}
    //       selected={sortKey === age}
    //       style={{ cursor: 'pointer' }}
    //     >
    //       <TableRowColumn>{age}</TableRowColumn>
    //     </TableRow>
    //   );
    // });

    let axis = null;

    if (xScale.ticks && yScale.range) {
      axis = (
        <Axis
          xScale={xScale}
          yScale={yScale}
          format={percentFormat}
          duration={duration}
        />
      );
    }

    return (
      <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
        <div className="col-md-6 col-sm-6">
          <span>Show Top {showTopN} States:</span>
        </div>
        <div className="col-md-6 col-sm-6">
          <span>Transition Duration: {(duration / 1000).toFixed(1)} Seconds</span>
        </div>
        <Chart view={view} trbl={trbl}>
          {barNodes}{axis}
        </Chart>
      </div>
    );
  }

  // render() {
  //   const { view, trbl, mounted, dispatch, sortKey, xScale, yScale } = this.props;
  //   const { duration, showTopN } = this.state;

  //   const barNodes = Object.keys(mounted).map((key) => {
  //     const node = mounted[key];
  //     return (
  //       <Bar
  //         key={key}
  //         node={node}
  //         xScale={xScale}
  //         yScale={yScale}
  //         duration={duration}
  //         removeNode={this.removeItem}
  //       />
  //     );
  //   });

  //   const tableRows = ages.map((age) => {
  //     return (
  //       <TableRow
  //         key={age}
  //         selected={sortKey === age}
  //         style={{ cursor: 'pointer' }}
  //       >
  //         <TableRowColumn>{age}</TableRowColumn>
  //       </TableRow>
  //     );
  //   });

  //   let axis = null;

  //   if (xScale.ticks && yScale.range) {
  //     axis = (
  //       <Axis
  //         xScale={xScale}
  //         yScale={yScale}
  //         format={percentFormat}
  //         duration={duration}
  //       />
  //     );
  //   }

  //   return (
  //     <Card>
  //       <CardHeader
  //         title="React Chart Transitions"
  //         subtitle="Enter, update and exit pattern using React 15.0, D3 4.0 and Redux"
  //         actAsExpander={false}
  //         showExpandableButton={false}
  //       />
  //       <div className="row" style={{ marginLeft: 0, marginRight: 0 }}>
  //         <div className="col-md-6 col-sm-6">
  //           <span>Show Top {showTopN} States:</span>
  //         </div>
  //         <div className="col-md-6 col-sm-6">
  //           <span>Transition Duration: {(duration / 1000).toFixed(1)} Seconds</span>
  //         </div>
  //       </div>
  //       <div className="row" style={{ margin: '20px 0px' }}>
  //         <div className="col-md-12 col-sm-12">
  //           <h4 style={{ marginTop: -45, marginBottom: -10 }}>Top States by Age Bracket, 2008</h4>
  //           <p>The bar chart shows the top states for the selected age bracket sorted by population percentage. Adapted from the Mike Bostock <a href="https://bost.ocks.org/mike/constancy/">example</a> on object constancy.</p>
  //         </div>
  //       </div>
  //       <div className="row">
  //         <div className="col-md-3 col-sm-3">
  //           <Table
  //             wrapperStyle={{ width: '100%' }}
  //             onCellClick={(d) => dispatch(updateSortOrder(ages[d]))}
  //           >
  //             <TableBody deselectOnClickaway={false}>
  //               {tableRows}
  //             </TableBody>
  //           </Table>
  //         </div>
  //         <div className="col-md-9 col-sm-9" style={{ padding: 0 }}>
  //           <Chart view={view} trbl={trbl}>
  //             {barNodes}{axis}
  //           </Chart>
  //         </div>
  //       </div>
  //     </Card>
  //   );
  // }
}

App.propTypes = {
  view: PropTypes.array.isRequired,
  trbl: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  mounted: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { view, trbl, xScale, yScale, sortKey, mounted } = state['states-by-age'];
  return { view, trbl, xScale, yScale, sortKey, mounted };
}

export default connect(mapStateToProps)(App);
