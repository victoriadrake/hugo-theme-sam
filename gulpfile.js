// "pug" will take pug files from /pug and convert them to html files in /layout.
// "sass" will take sass files from /sass and convert them to autoprefixed, minified files in /public/css.
// "critical" will take html files from /layouts and generate critical inline css, outputting ready-to-serve html files to /public.

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  pug = require('gulp-pug'),
  gutil = require('gulp-util');
  
gulp.task('pug', function () {
  // Compile .pug files to html
  gulp.src([
    'pug/**/*.pug',
  ]) // Input files
    .pipe(pug())
    .pipe(gulp.dest('layouts'));
});

gulp.task('sass', function () {
  // Process sass to minified css & autoprefix
  gulp.src('sass/*.sass')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('static/css/'));

});

gulp.task('watch', function () {
  // Process sass to minified css & autoprefix
  gulp.watch('sass/*.sass', function () {
    gulp.src('sass/*.sass')
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(autoprefixer())
      .pipe(gulp.dest('public/css/'));
  });

});