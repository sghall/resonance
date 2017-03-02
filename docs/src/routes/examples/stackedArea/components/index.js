// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, TableRow, TableCell, TableBody } from 'material-ui/Table';
import { LabelRadio, RadioGroup } from 'material-ui/Radio';
import { utcFormat } from 'd3-time-format';
import Checkbox from 'material-ui/Checkbox';
import Layout from 'material-ui/Layout';
import Paper from 'material-ui/Paper';
import Chart from 'resonance/Chart';
import NodeManager from 'resonance/NodeManager';
import TickManager from 'resonance/TickManager';
import { truncate } from 'docs/src/utils/helpers';
import { changeOffset, toggleFilter, makeGetSelectedData } from '../module';
import { VIEW, TRBL } from '../module/constants';
import Path from './Path';
import Tick from './Tick';

const dateFormat = utcFormat('%-d/%-m/%Y');

export class Example extends Component {

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

    const xAxisTicks = xScale.ticks ? xScale.ticks() : [];

    return (
      <Layout container gutter={24}>
        <Layout item xs={12} sm={12} md={12}>
          <Paper style={{ padding: 10, textAlign: 'center' }}>
            <RadioGroup
              name="offsets"
              selectedValue={offset}
              onChange={(e, d) => dispatch(changeOffset(d))}
              row
            >
              <LabelRadio
                value="stacked"
                label="Stacked"
              />
              <LabelRadio
                value="stream"
                label="Stream"
              />
              <LabelRadio
                value="expand"
                label="Expand"
              />
            </RadioGroup>
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
                      <TableCell padding={false}>{truncate(d.name, 20)}</TableCell>
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
              <NodeManager
                data={paths}
                xScale={xScale}
                yScale={yScale}
                duration={duration}
                keyAccessor={(d) => d.name}
                nodeComponent={Path}
              />
              <TickManager
                scale={yScale}
                xScale={xScale}
                duration={duration}
                tickComponent={Tick}
              />
              {xAxisTicks.map((d) => {
                const date = dateFormat(d);
                return (
                  <g opacity={0.6} key={date} transform={`translate(${xScale(d)})`}>
                    <line
                      style={{ pointerEvents: 'none' }}
                      x1={0} y1={0}
                      x2={0} y2={yScale.range()[0]}
                      opacity={0.2}
                      stroke="#fff"
                    />
                    <text
                      fontSize="9px"
                      textAnchor="middle"
                      fill="white"
                      x={0} y={-10}
                    >{date}</text>
                  </g>
                );
              })}
            </Chart>
          </Paper>
        </Layout>
      </Layout>
    );
  }
}

Example.propTypes = {
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


export default connect(makeMapStateToProps())(Example);
