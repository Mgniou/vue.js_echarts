var webpack= require('webpack')
var path = require('path')
var config = require('./config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')


// 分析入口文件和模板
var commonLibName = 'common-lib'
var allEntries = utils.getEntry('src/pages/**/*Entry.js', 'src/pages/', [commonLibName])
// 用到什么公共lib css（例如cookie），就把它加进common去，目的是将公用库单独提取打包
allEntries.entries[commonLibName] = [
    'vue',
    'cookie',
    path.resolve(__dirname, '../src/commonjs/common/index.js'),  // 通用
    path.resolve(__dirname, '../src/commonjs/base.js'),  // 基础方法
    path.resolve(__dirname, '../src/sass/common.scss')
]


module.exports = {
  entry: allEntries.entries,
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
        'vue': 'vue/dist/vue.js',
        'cookie': path.resolve(__dirname, '../src/lib/cookie'),
        "components": path.resolve(__dirname, '../src/components'),
        "commonjs": path.resolve(__dirname, '../src/commonjs')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules|lib|dev\/avalon|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader?limit=8192&name=' + config.imageDirName + '/[name].[hash].[ext]'
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?t=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=' + config.fontDirName + '/[name].[hash].[ext]' //这里前缀路径 publicPath 参数为基础
      },
      {
        test: /\.html$/,
        loader: "html",
        query: {
          minimize: false,    // 不开启压缩html
          removeComments: true,
          collapseWhitespace: false, //删除空白符与换行符
          customAttrSurround: [ [/#/, /(?:)/], [/\*/, /(?:)/], [/\[?\(?/, /(?:)/] ,[/\@[^=]*/, /\s?/,/\{\{(#|\^)[^}]+\}\}/,/\{\{\/[^}]+\}\}/,/\{\% if[^}]+\%\}/,/\{\%[^}]+endif \%\}/]],
          customAttrAssign: [ /\)?\]?=/ ],
        }
      },
    ]
  },
  plugins: [
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
          name: commonLibName,
          minChunks: Infinity
      })
  ].concat(allEntries.templates),
  vue: {
    postcss: [
      require('autoprefixer')({
        browsers:  ['last 3 versions','> 5%','ie >= 8','Firefox >= 10','last 3 Safari versions']
      })
    ]
  }
}
