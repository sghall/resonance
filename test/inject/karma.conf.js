var webpackConfig = require('./webpack.conf.js');

module.exports = function karmaConfig(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [
      {pattern: 'test/*_test.js', watched: false},
    ],

    preprocessors: {
      'test/*_test.js': ['webpack'],
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity,
    webpack: webpackConfig
  });
}
