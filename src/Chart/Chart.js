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
    paper: {
      backgroundColor: palette.background.paper,
    },
    rounded: {
      borderRadius: '2px',
    },
    ...shadows,
  };
});

/**
 * Material chart wrapper.
 *
 * ```js
 * import Chart from 'material-ui/Chart';
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
  const className = classNames(classes.paper, classes[classNameZDepth], {
    [classes.rounded]: rounded,
  }, classNameProp);

  return (
    <div className={className} {...other} />
  );
}

Chart.propTypes = {
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
