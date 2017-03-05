// @flow weak

const unitContext = require.context('../src/', true, /\.spec\.(js|jsx)$/);
unitContext.keys().forEach(unitContext);
