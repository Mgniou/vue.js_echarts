var path = require('path')
var config = require('./config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var sourceMap = config.productionSourceMap && config.cssSourceMap

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: sourceMap, extract: true })
  },
  devtool: config.productionSourceMap ? '#source-map' : false,
  output: {
    filename: config.jsDirName + '/[name].js?[chunkhash]',
    chunkFilename: config.jsDirName + '/[id].js?[chunkhash]'
  },
  vue: {
    loaders: utils.cssLoaders({ sourceMap: sourceMap, extract: true })
  },
  plugins: [
    // 提取css插件
    new ExtractTextPlugin(config.cssDirName + '/[name].css?[contenthash]', { allChunks: true }),
    new webpack.optimize.DedupePlugin()
  ]
})

module.exports = webpackConfig
