const config = require('config');
const path = require('path');
// const ip = require('ip'); 
const { devPlugin } = require('./options/plugins');
const { devOptimization } = require('./options/optimization');
const jsRules = require('./rules/jsRules');

 
const JS_SOURCE = config.get('jsSourcePath');
const PORT = 8080;
// const HOST = process.env.HOST || config.get('host') || '0.0.0.0'
// const PORT = process.env.PORT || config.get('port') || '8080'
// const APP_ENTRY_POINT = `${JS_SOURCE}/main`

module.exports = require('./webpack.config')({
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
    publicPath: ''
  },
  rules: [...jsRules.dev],
  plugins: devPlugin,
  optimization: devOptimization,
  devtool: 'source-map',
  devServer: {
    publicPath: '/',
    contentBase: path.resolve(__dirname, '../app/public'),
    host: '0.0.0.0',
    port: '3001',
    https: true,
    historyApiFallback: true,
    hot: true,
    open: true
  },
});
