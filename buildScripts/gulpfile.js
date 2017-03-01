var path = require('path');
var config = require('./config');
var gulp = require('gulp');
var buildDir = config.assetsRoot;

// gulp
// 错误管理，避免错误后结束进程
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var cleanCSS = require("gulp-clean-css");
var uglify = require('gulp-uglify');

function srcList(list,ext) {
    var result = [];
    ext = ext || '.js';
    list.forEach(function (v) {
        result.push(buildDir + '/' + v + '/**/**' + ext);
    });
    console.log('--->' + ext + ' path: [ ' + result + ' ]');
    return result;
}

gulp.task('build:css', function () {
    console.log('-->压缩css start....');
    return gulp.src(srcList([config.cssDirName],'.css'),{
        base:buildDir
    }).pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(cleanCSS({
            compatibility: 'ie7'
        }))
        .pipe(gulp.dest(buildDir));
});

gulp.task('build:js', function () {
    console.log('-->压缩js start....');
    return gulp.src(srcList([config.jsDirName],'.js'),{
        base:buildDir
    }).pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(uglify({
            sourceMap: false,
            compress: {
                warnings: false,
                drop_console: true,
                drop_debugger: true,
            },
            mangle: {except: ['$super', '$', 'exports', 'require','avalon']} //排除关键字
        }))
        .pipe(gulp.dest(buildDir));
});

exports.compressCssJsHtml = function (isHtml) {
    isHtml = isHtml || false;   // 默认不压缩html，为后面压缩html预留
    gulp.start(['build:css','build:js']);
};

