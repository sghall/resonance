// @flow weak

import React, { Component, PropTypes } from 'react';
import Text from 'material-charts/Text';
import Tick from './Tick';
import withSelection from './withSelection';

const ManagedTicks = withSelection(Tick);

export default class TickGroup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ticks: [],
      xScale0: null,
      xScale1: null,
    };
  }

  componentDidMount() {
    const { props } = this;
    this.update(props, props);
  }

  componentWillReceiveProps(next) {
    const { props } = this;
    if (props.xScale !== next.xScale) {
      this.update(next, props);
    }
  }

  update({ xScale }, props) {
    this.setState({
      ticks: xScale.ticks(),
      xScale0: props.xScale,
      xScale1: xScale,
    });
  }

  render() {
    const { state: { ticks, xScale0, xScale1 }, props: { duration, yScale } } = this;
    console.log('render TickGroup!!!', ticks);

    return (
      <ManagedTicks
        data={ticks}
        xScale0={xScale0}
        xScale1={xScale1}
        yHeight={yScale.range()[1]}
        duration={duration}
      />
    );


    // return (
    //   <Text x={100} y={100}>It is working</Text>
    // );
  }
}

TickGroup.propTypes = {
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  format: PropTypes.func.isRequired,
  duration: PropTypes.number.isRequired,
};
