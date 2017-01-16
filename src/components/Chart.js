import React, { Component, PropTypes } from 'react';

export class Chart extends Component {
  render() {
    let { view, trbl, children } = this.props;

    return (
      <div
        style={{
          width: '100%',
          height: '0px',
          paddingTop: `${Math.round(view[1] / view[0] * 100)}%`,
          position: 'relative'
        }}
      >
        <svg
          style={{position: 'absolute', top: 0, left: 0}}
          viewBox={`0 0 ${view[0]} ${view[1]}`}
        >
          <g transform={`translate(${trbl[3]} ,${trbl[0]})`}>
            {children}
          </g>
        </svg>
      </div>
    );
  }
}

Chart.propTypes = {
  view: PropTypes.array.isRequired,
  trbl: PropTypes.array.isRequired,
  children: PropTypes.array.isRequired
};
