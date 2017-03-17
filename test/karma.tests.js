const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const unitContext = require.context('../src/', true, /\.spec\.(js|jsx)$/);
unitContext.keys().forEach(unitContext);
