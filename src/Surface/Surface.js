// @flow weak

import React, { PropTypes } from 'react';

/**
 * A piece of material Surface.
 *
 * ```js
 * import Surface from 'resonance/Surface';
 *
 * const Component = () => <Surface zDepth={8}>Hello World</Surface>;
 * ```
 */
export default function Surface(props) {
  const { className, view, trbl, children, ...other } = props;

  return (
    <div
      style={{
        width: '100%',
        height: '0px',
        paddingTop: `${Math.round(view[1] / (view[0] * 100))}%`,
        position: 'relative',
      }}
    >
      <svg
        className={className}
        viewBox={`0 0 ${view[0]} ${view[1]}`}
        {...other}
      >
        <g transform={`translate(${trbl[3]} ,${trbl[0]})`}>
          {children}
        </g>
      </svg>
    </div>
  );
}

Surface.propTypes = {
  /**
   * The CSS class name of the root element.
   */
  children: PropTypes.node,
  /**
   * The CSS class name of the root element.
   */
  className: PropTypes.string,
  /**
   * Shadow depth, corresponds to `dp` in the spec.
   */
  trbl: PropTypes.array,
  /**
   * Set to false to disable rounded corners.
   */
  view: PropTypes.array,
};

Surface.defaultProps = {
  view: [1000, 250],
  trbl: [10, 10, 10, 10],
};

