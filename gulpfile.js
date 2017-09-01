const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

gulp.task('move:js', () => {
  return gulp.src(['../utils/**/*'])
    .pipe(gulp.dest('./utils/'));
});

gulp.task('babelify', ['move:js'], () => {
  return browserify('./public/js/main.js')
    .transform(babelify, { presets: ['es2015'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('default', ['babelify']);