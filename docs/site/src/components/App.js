// @flow weak

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider, { MUI_SHEET_ORDER } from 'material-ui/styles/MuiThemeProvider';
import createPalette from 'material-ui/styles/palette';
import createMuiTheme from 'material-ui/styles/theme';
import { brown, pink } from 'material-ui/styles/colors';
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
      50: '#e5f4f3',
      100: '#bee4e1',
      200: '#93d3cd',
      300: '#67c1b8',
      400: '#47b3a9',
      500: '#26a69a',
      600: '#229e92',
      700: '#1c9588',
      800: '#178b7e',
      900: '#0d7b6c',
      A100: '#adfff3',
      A200: '#7affec',
      A400: '#47ffe4',
      A700: '#2dffe0',
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
