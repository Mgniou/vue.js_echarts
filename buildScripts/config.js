// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')


// 添加目录前缀，用来区分webpack打包生成的资源
var addPrefix = function (str) {
  return 'wp_' + str + '/';
}

module.exports = {
    // 打包根目录
    assetsRoot: path.resolve(__dirname, '../build'),
    // 从浏览器访问时，资源的根路径
    assetsPublicPath: '/',
    // 需要拷贝的静态资源的路径
    assetsCopyPath: './src/static',
    // 打包时是否开启sourcemap
    productionSourceMap: false,
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    // 是否开启css sourcemap
    cssSourceMap: false,
    // 开发服务器配置
    devServer: {
        devHost: 'localhost',
        port: 3888,
    },
    // 开发后端代理配置
    proxyTable: {
      '/api/': {
          //target: 'http://192.168.1.160:90/',
          target: 'http://123.56.74.15:9002/wdyun_report',
          secure: false,
          changeOrigin: true
      }
    },
    // 所有css编译打包到这个目录
    cssDirName: addPrefix('css'),
    // 所有js编译打包到这个目录
    jsDirName: addPrefix('js'),
    // 所有图片编译打包到这个目录
    imageDirName: addPrefix('images'),
    // 所有字体编译打包到这个目录
    fontDirName: addPrefix('fonts'),
    // 所有视图编译打包到这个目录
    // viewDirName: addPrefix('views')
    // viewDirName: '.'
    viewDirName: ''
}
