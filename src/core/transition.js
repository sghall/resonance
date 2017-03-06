// @flow weak
import tween from './tween';

function transition(params) {
  Object.keys(params).forEach((ref) => {
    Object.keys(params[ref]).forEach((attr) => {
      const value = params[ref][attr];

      if (Array.isArray(value)) {
        this[ref].setAttribute(attr, value[0]);
        const interp = tween.call(this[ref], attr, value[1]);
        console.log(interp);
      }
    });
  });
}

export default transition;
