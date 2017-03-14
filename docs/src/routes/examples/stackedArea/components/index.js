// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { utcFormat } from 'd3-time-format';
import Slider from 'material-ui/Slider';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
import TickGroup from 'resonance/TickGroup';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import { changeOffset, toggleFilter, makeGetSelectedData } from '../module';
import { VIEW, TRBL } from '../module/constants';
import Path from './Path';
import Tick from './Tick';

const dateFormat = utcFormat('%-d/%-m/%Y');

export class Example extends Component {
  constructor(props) {
    super(props);

    (this:any).setDuration = this.setDuration.bind(this);
    (this:any).setShowTopN = this.setShowTopN.bind(this);
  }

  state = {
    duration: 1000,
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
      <div className="row">
        <div className="col-md-12 col-sm-12">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <MarkdownElement text={'gfdgdgdfgdfg'} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <span>Chart Offset:</span>
              <RadioButtonGroup
                name="offsets"
                valueSelected={offset}
                onChange={(e, d) => dispatch(changeOffset(d))}
              >
                <RadioButton
                  value="stacked"
                  label="Stacked"
                />
                <RadioButton
                  value="stream"
                  label="Stream"
                />
                <RadioButton
                  value="expand"
                  label="Expand"
                />
              </RadioButtonGroup>
            </div>
            <div className="col-md-6 col-sm-6">
              <span>Transition Duration: {(duration / 1000).toFixed(1)} Seconds</span>
              <Slider
                defaultValue={0.1}
                onChange={this.setDuration}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-3">
              <Table
                multiSelectable
                wrapperStyle={{ width: '100%' }}
                onCellClick={(d) => dispatch(toggleFilter(d))}
              >
                <TableBody deselectOnClickaway={false}>
                  {filter.map((d) => {
                    const isSelected = d.show;
                    return (
                      <TableRow
                        key={d.name}
                        selected={isSelected}
                      >
                        <TableRowColumn>{d.name}</TableRowColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="col-md-9 col-sm-9" style={{ padding: 0 }}>
              <Surface view={VIEW} trbl={TRBL}>
                <NodeGroup
                  data={paths}
                  xScale={xScale}
                  yScale={yScale}
                  duration={duration}
                  keyAccessor={(d) => d.name}
                  nodeComponent={Path}
                />
                <TickGroup
                  scale={yScale}
                  xScale={xScale}
                  offset={offset}
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
                        stroke="grey"
                      />
                      <text
                        fontSize="9px"
                        textAnchor="middle"
                        fill="grey"
                        x={0} y={-10}
                      >{date}</text>
                    </g>
                  );
                })}
              </Surface>
            </div>
          </div>
        </div>
      </div>
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
