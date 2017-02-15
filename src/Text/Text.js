// @flow weak

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from '../utils/customPropTypes';

export const textFills = [
  'primary',
  'secondary',
  'disabled',
  'hint',
  'icon',
  'divider',
  'lightDivider',
];

export const textTypes = [
  'body1',
  'body2',
  'display1',
  'display2',
  'display3',
  'display4',
  'title',
  'caption',
  'headline',
  'subheading',
];

export const styleSheet = createStyleSheet('MC-Text', (theme) => {
  const styles = {};

  textTypes.reduce((m, n) => {
    const type = theme.typography[n];
    const { fontSize, fontWeight, fontFamily, color: fill } = type;
    return Object.assign(m, { [n]: { fontSize, fontWeight, fontFamily, fill } });
  }, styles);

  textFills.reduce((m, n) => {
    return Object.assign(m, { [n]: { fill: theme.palette.text[n] } });
  }, styles);

  return styles;
});

export default function Text(props, context) {
  const {
    className: classNameProp,
    textFill,
    textType,
    ...other
  } = props;

  const classes = context.styleManager.render(styleSheet);

  const className = classNames(classes[textFill], classes[textType], {
  }, classNameProp);

  return <text className={className} {...other} />;
}

Text.propTypes = {
  /**
   * The CSS class name of the root element.
   */
  className: PropTypes.string,
  textFill: PropTypes.oneOf(textFills),
  textType: PropTypes.oneOf(textTypes),
};

Text.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};
