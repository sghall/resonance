// @flow weak

export default function (state = { dark: true }, action) {
  if (action.type === 'TOGGLE_THEME_SHADE') {
    return {
      ...state,
      dark: !state.dark,
    };
  }
  return state;
}
