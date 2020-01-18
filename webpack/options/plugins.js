const webpack = require('webpack');
const config = require('config');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
/**dev */
const CircularDependencyPlugin = require('circular-dependency-plugin');
// /**prod */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;//查看打包后的内容

exports.devPlugin = [
  new webpack.HotModuleReplacementPlugin(), // enable HMR globally
  new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
    DEBUG: false
  }),
  new HtmlWebpackPlugin({
    title: "React App",
    template: path.resolve(__dirname, "../../app/public/index.html"),
    minify: false
  }),
  new CircularDependencyPlugin({
    exclude: /a\.js|node_modules/, // exclude node_modules
    failOnError: false // show a warning when there is a circular dependency
  }),
];

exports.prodPlugin = [
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.IgnorePlugin(/un~$/),
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'production', // use 'development' unless process.env.NODE_ENV is defined
    DEBUG: false
  }),
  new webpack.DefinePlugin({
    __CONFIG__: JSON.stringify(config.get('app')),
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "../../app/public/index.html"),
    // inject: 'body',
    // title: package.title,
    // filename: package.filename,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
    inject: true,
    // append: {
    //   head: `<script src="//cdn.polyfill.io/v3/polyfill.min.js"></script>`
    // },
    // meta: {
    //   title: package.name,
    //   description: package.description,
    //   keywords: Array.isArray(package.keywords) ? package.keywords.join(',') : undefined
    // }
  }),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: `public/styles/[name]-[hash].css`,
    chunkFilename: `public/styles/[id]-[hash].css`,
  }),
  new CopyWebpackPlugin([
    {
      from: "app/public",
      to: "",
      ignore: ["img/**/*", "index.html"]
    }
  ]),
  // new BundleAnalyzerPlugin()
];