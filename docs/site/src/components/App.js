// @flow weak

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider, { MUI_SHEET_ORDER } from 'material-ui/styles/MuiThemeProvider';
import createPalette from 'material-ui/styles/palette';
import createMuiTheme from 'material-ui/styles/theme';
import { lightTheme, darkTheme, setPrismTheme } from 'docs/site/src/utils/prism';
import AppRouter from '../routes';

function App(props) {
  const { dark } = props;

  const palette = createPalette({
    primary: {
      50: '#e4e5ea',
      100: '#bcbfcb',
      200: '#9094a8',
      300: '#646985',
      400: '#42486b',
      500: '#212851',
      600: '#1d244a',
      700: '#181e40',
      800: '#141837',
      900: '#0b0f27',
      A100: '#6574ff',
      A200: '#3246ff',
      A400: '#0018fe',
      A700: '#0016e5',
      contrastDefaultColor: 'light',
    },
    accent: {
      50: '#efece5',
      100: '#d6cfbe',
      200: '#bbaf93',
      300: '#9f8f67',
      400: '#8b7747',
      500: '#765f26',
      600: '#6e5722',
      700: '#634d1c',
      800: '#594317',
      900: '#46320d',
      A100: '#ffcd7f',
      A200: '#ffb94c',
      A400: '#ffa619',
      A700: '#fe9c00',
      constrastDefaultColor: 'light',
    },
    type: dark ? 'dark' : 'light',
  });

  const { styleManager, theme } = MuiThemeProvider.createDefaultContext({
    theme: createMuiTheme({ palette }),
  });

  styleManager.setSheetOrder(MUI_SHEET_ORDER.concat([
    'AppContent',
    'AppDrawer',
    'AppDrawerNavItem',
    'AppFrame',
    'MarkdownDocs',
    'MarkdownElement',
    'Demo',
  ]));

  if (dark) {
    setPrismTheme(darkTheme);
  } else {
    setPrismTheme(lightTheme);
  }

  return (
    <MuiThemeProvider theme={theme} styleManager={styleManager}>
      <AppRouter />
    </MuiThemeProvider>
  );
}

App.propTypes = {
  dark: PropTypes.bool.isRequired,
};

export default connect((state) => ({ dark: state.theme.dark }))(App);
