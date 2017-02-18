// @flow weak

export const COUNTER_INCREMENT = 'COUNTER_INCREMENT';
export const COUNTER_DOUBLE_ASYNC = 'COUNTER_DOUBLE_ASYNC';

export function increment(value = 1) {
  return {
    type: COUNTER_INCREMENT,
    payload: value,
  };
}

export const doubleAsync = () => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch({
          type: COUNTER_DOUBLE_ASYNC,
          payload: getState().counter,
        });
        resolve();
      }, 200);
    });
  };
};

export const actions = {
  increment,
  doubleAsync,
};

const ACTION_HANDLERS = {
  [COUNTER_INCREMENT]: (state, action) => state + action.payload,
  [COUNTER_DOUBLE_ASYNC]: (state) => state * 2,
};

const initialState = 0;

export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
