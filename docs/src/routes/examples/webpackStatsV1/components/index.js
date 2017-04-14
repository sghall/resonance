// @flow weak

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';
import Surface from 'resonance/Surface';
import NodeGroup from 'resonance/NodeGroup';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import Arc from './Arc';
import { updateTopCount, makeGetSelectedData } from '../module';
import { VIEW, TRBL, DIMS } from '../module/constants';
import description from '../description.md';

const arcKeyAccessor = (d) => d.filePath;

export class Example extends Component {
  constructor(props) {
    super(props);

    (this:any).setShowTop = this.setShowTop.bind(this);
    (this:any).setDuration = this.setDuration.bind(this);
  }

  state = {
    duration: 500,
    showTop: this.props.showTop,
  }

  setShowTop(e, value) {
    this.setState({
      showTop: value,
    });
  }

  setDuration(e, value) {
    this.setState({
      duration: Math.floor(value * 10000),
    });
  }

  render() {
    const { data, dispatch } = this.props;
    const { duration, showTop } = this.state;

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
              <div className="col-md-6 col-sm-6">
                <h5>Show Top {showTop} States:</h5>
                <Slider
                  min={5} max={25} step={1}
                  value={showTop}
                  onChange={this.setShowTop}
                  onDragStop={() => dispatch(updateTopCount(showTop))}
                />
              </div>
              <div className="col-md-6 col-sm-6">
                <h5>Transition Duration: {(duration / 1000).toFixed(1)} Seconds</h5>
                <Slider
                  defaultValue={0.1}
                  onChange={this.setDuration}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-sm-12" style={{ padding: 0 }}>
                <h3>This example is under construction</h3>
                <Surface view={VIEW} trbl={TRBL}>
                  <g transform={`translate(${DIMS[0] / 2},${DIMS[1] / 2})`}>
                    <NodeGroup
                      data={data}
                      duration={duration}
                      keyAccessor={arcKeyAccessor}
                      nodeComponent={Arc}
                    />
                  </g>
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
  data: PropTypes.array.isRequired,
  showTop: PropTypes.number.isRequired,
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
