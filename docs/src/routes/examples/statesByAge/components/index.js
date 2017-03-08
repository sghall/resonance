// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, TableRow, TableCell, TableBody } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Layout from 'material-ui/Layout';
import Paper from 'material-ui/Paper';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
import TickGroup from 'resonance/TickGroup';
import { updateSortOrder, makeGetSelectedData } from '../module';
import { VIEW, TRBL, AGES } from '../module/constants';
import Bar from './Bar';
import Tick from './Tick';

export class Example extends Component {

  constructor(props) {
    super(props);

    (this:any).setDuration = this.setDuration.bind(this);
    (this:any).setShowTopN = this.setShowTopN.bind(this);
  }

  state = {
    duration: 1000,
    showTopN: this.props.showTop,
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
                xScale={xScale}
                yScale={yScale}
                duration={duration}
                nodeComponent={Bar}
              />
              <TickGroup
                scale={xScale}
                duration={duration}
                tickComponent={Tick}
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
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
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
