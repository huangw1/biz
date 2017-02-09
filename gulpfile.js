var gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    cleancss = require('gulp-clean-css'),
    del = require('del'),
    webpack = require('webpack-stream'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    template = require('gulp-compile-template'),
    banner = require('gulp-banner'),
    postcssClean = require('postcss-clean'),
    named = require('vinyl-named'),
    path = require('path'),
    exec = require('child_process').execSync,
    pkg = require('./package.json');

var src = 'src',
    build = 'build',
    dist = 'dist',
    static = 'static',
    compress = true;

gulp.task('tpl', function() {
    var target = path.join(src, 'js/tpl')

    return gulp.src([src + '/js/tpl/html/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(template({
            underscore: {
                variable: 'data'
            }
        }))
        .pipe(gulp.dest(target))
})


gulp.task('js', ['tpl'], function() {
    var target = path.join(dist, 'js')
    var stream = gulp.src([src + '/js/Biz.style.js'])
                .pipe(named(function(file) {
                    var args = path.parse(file.path)
                    return args.name
                }))
                .pipe(webpack({
                    module: {
                        loaders: [{
                            test: /\.less$/,
                            loader: 'small-style?{"insertAt":"top"}!postcss!less'
                        }]
                    },
                    postcss: function() {
                        return [postcssClean()]
                    }
                }))

    stream = stream.pipe(gulp.dest(target))

    compress && (stream = stream.pipe(uglify()))

    return stream.pipe(rename(function(path) {
        return path.basename += '.min'
    }))
    .pipe(gulp.dest(target))
})


gulp.task('default', function() {
    gulp.start('js', 'watch')

})

gulp.task('watch', function() {
    gulp.watch([src + '/**/*.js', src + '/**/*.html', src + '/**/*.less'], function() {
        gulp.start('js')
    })
})