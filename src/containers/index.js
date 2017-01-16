import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateSortOrder, updateTopCount, removedNode } from '../actions';
import { Table, TableRow, TableRowColumn, TableBody } from 'material-ui/table';
import { Card, CardHeader } from 'material-ui/Card';
import Slider from 'material-ui/Slider';
import { Chart } from '../components/Chart';
import { Axis } from '../components/Axis';
import { Bar } from '../components/Bar';

import { format } from 'd3-format';
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
  '85 Years and Over'
];

export class App extends Component {

  constructor(props) {
    super(props);

    this.state ={
      duration: 1000,
      showTopN: 10
    };
  }

  componentDidMount() {
    let { dispatch, sortKey } = this.props;
    dispatch(updateSortOrder(sortKey));
  }

  removeItem(key) {
    let {dispatch} = this.props;
    dispatch(removedNode(key));
  }

  setDuration(e, value) {
    this.setState({
      duration: Math.floor(value * 10000)
    });
  }

  setShowTopN(e, value) {
    this.setState({
      showTopN: Math.floor(value * 20) + 5
    });
  }

  render() {
    let {view, trbl, mounted, dispatch, sortKey, xScale, yScale} = this.props;
    let {duration, showTopN} = this.state;

    let barNodes = Object.keys(mounted).map(key => {
      let node = mounted[key];
      return (
        <Bar 
          key={key}
          node={node}
          xScale={xScale}
          yScale={yScale}
          duration={duration}
          removeNode={this.removeItem.bind(this)}
        />
      );
    });

    let tableRows = ages.map(age => {
      return (
        <TableRow
          key={age}
          selected={sortKey === age} 
          style={{cursor: 'pointer'}}
        >
          <TableRowColumn>{age}</TableRowColumn>
        </TableRow>
      );
    });

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
      <Card>
        <CardHeader
          title="React Chart Transitions"
          subtitle="Enter, update and exit pattern using React 15.0, D3 4.0 and Redux"
          actAsExpander={false}
          showExpandableButton={false}
        />
        <div className='row' style={{marginLeft: 0, marginRight: 0}}>
          <div className='col-md-6 col-sm-6'>
            <span>Show Top {showTopN} States:</span>
            <Slider
              style={{margin: '5px 0px'}}
              defaultValue={0.25}
              onChange={this.setShowTopN.bind(this)}
              onDragStop={() => dispatch(updateTopCount(showTopN))}
            />
          </div>
          <div className='col-md-6 col-sm-6'>
            <span>Transition Duration: {(duration / 1000).toFixed(1)} Seconds</span>
            <Slider
              style={{margin: '5px 0px'}}
              defaultValue={0.1}
              onChange={this.setDuration.bind(this)}
            />
          </div>
        </div>
        <div className='row' style={{margin: '20px 0px'}}>
          <div className='col-md-12 col-sm-12'>
            <h4 style={{marginTop: -45, marginBottom: -10}}>Top States by Age Bracket, 2008</h4>
            <p>The bar chart shows the top states for the selected age bracket sorted by population percentage. Adapted from Mike Bostock's <a href='https://bost.ocks.org/mike/constancy/'>classic example</a> on object constancy.</p>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-3 col-sm-3'>
            <Table
              wrapperStyle={{width: '100%'}} 
              onCellClick={d => dispatch(updateSortOrder(ages[d]))}
            >
              <TableBody deselectOnClickaway={false}>
                {tableRows}
              </TableBody>
            </Table>
          </div>
          <div className='col-md-9 col-sm-9' style={{padding: 0}}>
            <Chart view={view} trbl={trbl}>
              {barNodes}{axis}
            </Chart>
          </div>
        </div>
      </Card>
    );
  }
}

App.propTypes = {
  view: PropTypes.array.isRequired,
  trbl: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  mounted: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  let {view, trbl, xScale, yScale, sortKey, mounted} = state;
  return {view, trbl, xScale, yScale, sortKey, mounted};
}

export default connect(mapStateToProps)(App);
