'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var less = require('gulp-less');

gulp.task('scripts', () => {
    gulp.src('./assets/scripts/editor/index.js')
        .pipe(browserify({
            transform: ['babelify'],
            insertGlobals: true
        }))
        .pipe(concat('editor.js'))
        .pipe(gulp.dest('./static/scripts/'));
});

gulp.task('styles', () => {
  return gulp.src('./assets/styles/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./static/styles'));
});

gulp.task('watch', ['default'], () => {
    gulp.watch('./assets/scripts/**/*.js', ['scripts']);
    gulp.watch('./assets/styles/**/*.less', ['styles']);
});

gulp.task('default', ['scripts', 'styles']);
