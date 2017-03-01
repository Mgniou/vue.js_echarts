var config = require('./config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')

// 添加热更新
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./buildScripts/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  output: {
    filename: config.jsDirName + '/[name].js',
    chunkFilename: config.jsDirName + '/[id].js'
  },
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.cssSourceMap })
  },
  vue: {
      loaders: utils.cssLoaders({ sourceMap: config.cssSourceMap })
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ]
})
