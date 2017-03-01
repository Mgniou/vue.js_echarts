var path = require('path')
var glob = require('glob')
var pkg = require("../package.json")
var config = require('./config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// https://github.com/ampedandwired/html-webpack-plugin
var HtmlWebpackPlugin = require('html-webpack-plugin')

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    scss: generateLoaders(['css', 'sass']),
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}

/**
 * 获得路径
 * @param globPath: str
 * @param pathDir: str 对比路径
 * @returns {{}}
 */
exports.getEntry = function (globPath, pathDir, commmonChunks) {
    var files = glob.sync(globPath);
    var entries = {},
        templates = [],
        entry, dirname, basename, pathname, extname, outFileName;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.normalize(path.join(dirname,  basename));
        pathDir = path.normalize(pathDir);
        outFileName = path.normalize(dirname);
        if(pathname.startsWith(pathDir)){
            pathname = pathname.substring(pathDir.length)
        }

        if(outFileName.startsWith(pathDir)){
            outFileName = outFileName.substring(pathDir.length)
        }else{
            outFileName = pathname;
        }

        // path window和liunx斜线相反 ...
        pathname = pathname.replace(/\\/g,'/');
        outFileName = outFileName.replace(/\\/g,'/');

        entries[outFileName] = ['./' + entry];
        templates.push(new HtmlWebpackPlugin({
            skin: pkg.skin,
            mainTitle: pkg.mainTitle,
            chunks: commmonChunks.concat(outFileName),
            filename: config.viewDirName + outFileName + '.html',
            //filename: config.viewDirName + '/' + outFileName + '.html',
            template: './src/pages/' + pathname + '.ejs',
            inject: 'body',
            chunksSortMode: 'dependency',
            hash: false,
          /*
           * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
           * 如在html标签属性上使用{{...}}表达式，很多情况下并不需要在此配置压缩项，
           * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
           * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
           */

            // minify: { //压缩HTML文件
            //     removeComments: true, //移除HTML中的注释
            //     collapseWhitespace: false //删除空白符与换行符
            // }
        }));

    }
    return {
        entries:entries,
        templates:templates
    };
}
