// @flow weak

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from '../utils/customPropTypes';

export const styleSheet = createStyleSheet('Chart', (theme) => {
  const { palette } = theme;
  const shadows = {};

  theme.shadows.forEach((shadow, index) => {
    shadows[`dp${index}`] = {
      boxShadow: shadow,
    };
  });

  return {
    chart: {
      backgroundColor: palette.background.paper,
    },
    rounded: {
      borderRadius: '2px',
    },
  };
});

/**
 * A piece of material Chart.
 *
 * ```js
 * import Chart from 'material-charts/Chart';
 *
 * const Component = () => <Chart zDepth={8}>Hello World</Chart>;
 * ```
 */
export default function Chart(props, context) {
  const {
    className: classNameProp,
    rounded,
    zDepth,
    ...other
  } = props;
  const classes = context.styleManager.render(styleSheet);

  const classNameZDepth = `dp${zDepth >= 0 ? zDepth : 0}`;
  const className = classNames(classes.chart, classes[classNameZDepth], {
    [classes.rounded]: rounded,
  }, classNameProp);

  const view = [1000, 500];
  const trbl = [0, 0, 0, 0];

  return (
    <div
      className={className} {...other}
      style={{
        width: '100%',
        height: '0px',
        paddingTop: `${(Math.round(view[1] / view[0]) * 100)}%`,
        position: 'relative',
      }}
    >
      <svg
        style={{ position: 'absolute', top: 0, left: 0 }}
        viewBox={`0 0 ${view[0]} ${view[1]}`}
      >
        <g transform={`translate(${trbl[3]} ,${trbl[0]})`}>
          {props.children}
        </g>
      </svg>
    </div>
  );
}

Chart.propTypes = {
  /**
   * The CSS class name of the root element.
   */
  children: PropTypes.node,
  /**
   * The CSS class name of the root element.
   */
  className: PropTypes.string,
  /**
   * Set to false to disable rounded corners.
   */
  rounded: PropTypes.bool,
  /**
   * Shadow depth, corresponds to `dp` in the spec.
   */
  zDepth: PropTypes.number,
};

Chart.defaultProps = {
  rounded: true,
  zDepth: 2,
};

Chart.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};
