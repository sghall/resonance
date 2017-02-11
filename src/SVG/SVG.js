// @flow weak

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from '../utils/customPropTypes';

export const styleSheet = createStyleSheet('SVG', (theme) => {
  const { palette } = theme;
  const shadows = {};

  theme.shadows.forEach((shadow, index) => {
    shadows[`dp${index}`] = {
      boxShadow: shadow,
    };
  });

  return {
    svg: {
      backgroundColor: palette.background.paper,
    },
    rounded: {
      borderRadius: '2px',
    },
    ...shadows,
  };
});

/**
 * A piece of material svg.
 *
 * ```js
 * import SVG from 'material-charts/SVG';
 *
 * const Component = () => <SVG zDepth={8}>Hello World</SVG>;
 * ```
 */
export default function SVG(props, context) {
  const {
    className: classNameProp,
    rounded,
    zDepth,
    ...other
  } = props;
  const classes = context.styleManager.render(styleSheet);

  const classNameZDepth = `dp${zDepth >= 0 ? zDepth : 0}`;
  const className = classNames(classes.svg, classes[classNameZDepth], {
    [classes.rounded]: rounded,
  }, classNameProp);

  return (
    <div className={className} {...other} />
  );
}

SVG.propTypes = {
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

SVG.defaultProps = {
  rounded: true,
  zDepth: 2,
};

SVG.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};
