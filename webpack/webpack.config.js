const path = require('path');
const webpack = require('webpack');

const jsRules = require('./rules/jsRules');
const fileRules = require('./rules/fileRules');
const styleRules = require('./rules/styleRules');

module.exports = options => ({
  mode: options.mode,
  stats: 'errors-only',
  entry: [
      '@babel/polyfill',
      path.resolve(__dirname, '../app/main.js')
  ],
  output: options.output,
  optimization: Object.assign({
      removeAvailableModules:true,
      removeEmptyChunks:true,
      mergeDuplicateChunks:true
    },
    options.optimization
  ),
  module: {
    rules: options.rules.concat([...jsRules.common, ...styleRules, ...fileRules])
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      $: 'jquery',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        SERVICE_ENV: JSON.stringify(process.env.SERVICE_ENV),
      }
    })
  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: ['.js', '.jsx', '.scss', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
      'react-dom': '@hot-loader/react-dom', // fix react 16.6+ hot-loader 
      '@app': path.resolve(__dirname, '../app/'),
      '@components': path.resolve(__dirname, '../app/components/'),
      '@containers': path.resolve(__dirname, '../app/containers/'),
      '@global': path.resolve(__dirname, '../app/global/'),
      '@utils': path.resolve(__dirname, '../app/utils/'),
      '@pages': path.resolve(__dirname, '../app/pages/'),
      '@styles': path.resolve(__dirname, '../app/styles/'),
      '@lang': path.resolve(__dirname, '../app/language/'),
      'UploadFileFrom': path.resolve(__dirname, '../app/components/Form/UploadFileFrom'), //上传组件
    }
  },
  devtool: options.devtool,
  target: 'web',
  performance: options.performance || {},
  devServer: options.devServer || {},
});