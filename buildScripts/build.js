// https://github.com/shelljs/shelljs
require('./check-versions')()
require('shelljs/global')

env.NODE_ENV = 'production'

var program = require('commander')
program.option('-c, --copy <string>', 'a string argument')
  .parse(process.argv)

var path = require('path')
var config = require('./config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')
var gulpTask = require('./gulpfile')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for production...')
spinner.start()

// 复制不需要经过webpack处理的文件
if (program.copy !== 'no') {
  var assetsPath = config.assetsRoot;
  console.log('\n->（1）复制文件 start ..')
  rm('-rf', assetsPath)
  mkdir('-p', assetsPath)
  cp('-R', config.assetsCopyPath + '/*', assetsPath)
// console.log('\n->复制文件 end ..')
}

console.log('\n->（2）webpack 编译 start ..')
webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  // console.log('\n->webpack 编译成功 end ..')
  console.log('\n->（3）gulp 压缩文件 start ... ')
  gulpTask.compressCssJsHtml();
  // console.log('\n->gulp 压缩文件 end ... ')
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
