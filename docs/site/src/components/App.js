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
      50: '#e7e8ee',
      100: '#c2c5d4',
      200: '#999eb8',
      300: '#70779b',
      400: '#525985',
      500: '#333c70',
      600: '#2e3668',
      700: '#272e5d',
      800: '#202753',
      900: '#141a41',
      A100: '#7f8cff',
      A200: '#4c5eff',
      A400: '#1930ff',
      A700: '#001afe',
      constrastDefaultColor: 'light',
    },
    accent: {
      50: '#e5ebed',
      100: '#bfccd1',
      200: '#94abb3',
      300: '#698995',
      400: '#496f7e',
      500: '#295667',
      600: '#244f5f',
      700: '#1f4554',
      800: '#193c4a',
      900: '#0f2b39',
      A100: '#74cfff',
      A200: '#41beff',
      A400: '#0eadff',
      A700: '#00a0f4',
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
