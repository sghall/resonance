// @flow weak

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
import TickGroup from 'resonance/TickGroup';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import palette from 'docs/src/utils/palette';
import { updateData, changeOffset, changeTension, makeGetSelectedData } from '../module';
import { VIEW, TRBL } from '../module/constants';
import Path from './Path';
import Tick from './Tick';
import XAxis from './XAxis';
import description from '../description.md';

const getPathKey = (d) => d.name;

export class Example extends Component {
  constructor(props) {
    super(props);

    (this:any).setTension = this.setTension.bind(this);
    (this:any).setDuration = this.setDuration.bind(this);
    (this:any).changeOffset = this.changeOffset.bind(this);
    (this:any).changeTension = this.changeTension.bind(this);
  }

  state = {
    duration: 1000,
    tension: this.props.tension,
  }

  setTension(e, tension) {
    this.setState({ tension });
  }

  setDuration(e, duration) {
    this.setState({ duration });
  }

  changeOffset(e, d) {
    const { dispatch } = this.props;
    dispatch(changeOffset(d));
  }

  changeTension() {
    const { props, state } = this;
    props.dispatch(changeTension(state.tension));
  }

  render() {
    const { offset, paths, xScale, yScale, dispatch } = this.props;
    const { duration, tension } = this.state;

    return (
      <Paper style={{ padding: 20 }}>
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <MarkdownElement text={description} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 col-sm-4">
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <h5>Chart Offset:</h5>
                    <RadioButtonGroup
                      name="offsets"
                      valueSelected={offset}
                      onChange={this.changeOffset}
                    >
                      <RadioButton
                        value="stacked"
                        label="Stacked"
                      />
                      <RadioButton
                        value="stream"
                        label="Stream"
                      />
                    </RadioButtonGroup>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <RaisedButton
                      label="Update Data"
                      onClick={() => dispatch(updateData())}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-8 col-sm-8">
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <h5>Transition Duration: {(duration / 1000).toFixed(1)} Seconds</h5>
                    <Slider
                      min={0} max={10000} step={100}
                      value={duration}
                      onChange={this.setDuration}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <h5>Tension Setting: {(tension).toFixed(2)}</h5>
                    <Slider
                      min={0} max={1} step={0.01}
                      value={tension}
                      onChange={this.setTension}
                      onDragStop={this.changeTension}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-sm-12" style={{ padding: 0 }}>
                <Surface view={VIEW} trbl={TRBL}>
                  <TickGroup
                    scale={yScale}
                    xScale={xScale}
                    offset={offset}
                    duration={duration}
                    tickComponent={Tick}
                  />
                  <XAxis xScale={xScale} yScale={yScale} />
                  <NodeGroup
                    data={paths}
                    xScale={xScale}
                    yScale={yScale}
                    duration={duration}
                    keyAccessor={getPathKey}
                    nodeComponent={Path}

                  />
                </Surface>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}

Example.propTypes = {
  paths: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  offset: PropTypes.string.isRequired,
  tension: PropTypes.number.isRequired,
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
