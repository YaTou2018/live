const path = require("path");
const webpack = require("webpack");
const { prodPlugin } = require('./options/plugins');
const { prodOptimization } = require('./options/optimization');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const config = require("./webpack.config");


module.exports = require('./webpack.config')({
  mode: 'production',
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: './',
    filename: "public/scripts/[name].js",
    chunkFilename: "public/scripts/[name].[chunkhash].js",
  },
  rules: [],
  performance: {
      assetFilter: assetFilename => 
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
  // devtool: 'source-map',
  plugins: prodPlugin,
  optimization: prodOptimization,
})

