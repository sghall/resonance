// @flow weak

import { combineReducers } from 'redux';
import locationReducer from './location';
import themeReducer from './theme';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    theme: themeReducer,
    location: locationReducer,
    ...asyncReducers,
  });
};

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) {
    return;
  }

  store.asyncReducers[key] = reducer; // eslint-disable-line no-param-reassign
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
