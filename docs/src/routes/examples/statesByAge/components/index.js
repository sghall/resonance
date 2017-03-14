// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, TableRow, TableRowColumn, TableBody } from 'material-ui/table';
import Slider from 'material-ui/Slider';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
import TickGroup from 'resonance/TickGroup';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import { updateSortOrder, updateTopCount, makeGetSelectedData } from '../module';
import { VIEW, TRBL, AGES } from '../module/constants';
import Bar from './Bar';
import Tick from './Tick';
import description from '../description.md';

const barKeyAccessor = (d) => d.name;

export class Example extends Component {

  constructor(props) {
    super(props);

    (this:any).setDuration = this.setDuration.bind(this);
    (this:any).setShowTop = this.setShowTop.bind(this);
  }

  state = {
    duration: 1500,
    showTop: this.props.showTop,
  }

  setDuration(e, value) {
    this.setState({
      duration: Math.floor(value * 10000),
    });
  }

  setShowTop(e, value) {
    this.setState({
      showTop: value,
    });
  }

  render() {
    const { sortKey, data, xScale, yScale, dispatch } = this.props;
    const { duration, showTop } = this.state;

    return (
      <div className="row">
        <div className="col-md-12 col-sm-12">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <MarkdownElement text={description} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <span>Show Top {showTop} States:</span>
              <Slider
                min={5} max={25} step={1}
                value={showTop}
                onChange={this.setShowTop}
                onDragStop={() => dispatch(updateTopCount(showTop))}
              />
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
                wrapperStyle={{ width: '100%' }}
                onCellClick={(d) => dispatch(updateSortOrder(AGES[d]))}
              >
                <TableBody deselectOnClickaway={false}>
                  {AGES.map((age) => {
                    return (
                      <TableRow
                        key={age}
                        selected={sortKey === age}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableRowColumn>{age}</TableRowColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="col-md-9 col-sm-9" style={{ padding: 0 }}>
              <Surface view={VIEW} trbl={TRBL}>
                <NodeGroup
                  data={data}
                  xScale={xScale}
                  yScale={yScale}
                  duration={duration}
                  nodeComponent={Bar}
                  keyAccessor={barKeyAccessor}
                />
                <TickGroup
                  scale={xScale}
                  duration={duration}
                  tickCount={8}
                  tickComponent={Tick}
                />
              </Surface>
            </div>
          </div>
        </div>
      </div>
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
