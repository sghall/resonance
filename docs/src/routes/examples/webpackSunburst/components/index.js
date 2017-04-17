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
import { makeGetNodes, makeGetScales, updateScales } from '../module';
import { VIEW, TRBL, DIMS } from '../module/constants';
import description from '../description.md';
import { x, y } from './utils';

const arcKeyAccessor = (d) => d.filePath;

export class Example extends Component {
  constructor(props) {
    super(props);

    (this:any).setDuration = this.setDuration.bind(this);
    (this:any).setActiveArc = this.setActiveArc.bind(this);
  }

  state = {
    duration: 500,
  }

  componentWillMount() {
    const { xScale, yScale } = this.props;

    x.range(xScale.range()).domain(xScale.domain());
    y.range(yScale.range()).domain(yScale.domain());
  }

  componentWillReceiveProps(next) {
    const { xScale, yScale } = next;

    x.range(xScale.range()).domain(xScale.domain());
    y.range(yScale.range()).domain(yScale.domain());
  }

  setActiveArc(node) {
    const { dispatch } = this.props;
    dispatch(updateScales(node));
  }

  setDuration(e, value) {
    this.setState({
      duration: Math.floor(value * 10000),
    });
  }

  render() {
    const { nodes, xScale, yScale } = this.props;
    const { duration } = this.state;

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
              <div className="col-md-12 col-sm-12">
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
                      data={nodes}
                      duration={duration}
                      clickHandler={this.setActiveArc}
                      keyAccessor={arcKeyAccessor}
                      xScale={xScale}
                      yScale={yScale}
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
  nodes: PropTypes.array.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const getNodes = makeGetNodes();
  const getScales = makeGetScales();

  const mapStateToProps = (state) => {
    const { xScale, yScale } = getScales(state);

    return {
      xScale,
      yScale,
      nodes: getNodes(state),
    };
  };
  return mapStateToProps;
};


export default connect(makeMapStateToProps())(Example);
