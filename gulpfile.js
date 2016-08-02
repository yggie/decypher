const gulp = require('gulp')
const babelify = require('babelify')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')
const cachebreaker = require('gulp-cache-breaker')
const open = require('gulp-open')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')

gulp.task('build', ['compile-js', 'compile-scss'], compileHTML)

gulp.task('open', ['build'], () => {
  return gulp.src('target/web/index.html')
    .pipe(open())
})

gulp.task('default', ['open'])

gulp.task('watch', ['build'], () => {
  gulp.watch('web/**/*.jsx', ['compile-js-and-break-cache'])
  gulp.watch('web/stylesheets/**/*.scss', ['compile-scss-and-break-cache'])
  gulp.watch('web/**/*.html', ['compile-html'])
})

gulp.task('compile-js', () => {
  const bundler = browserify({
    entries: 'web/main.jsx',
    debug: true,
  })

  bundler.transform(babelify, {
    presets: ['es2015', 'react'],
  })

  return bundler.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulp.dest('target/web'))
})

gulp.task('compile-scss', () => {
  return gulp.src('web/stylesheets/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('target/web'))
})

gulp.task('compile-js-and-break-cache', ['compile-js'], breakCache)
gulp.task('compile-scss-and-break-cache', ['compile-scss'], breakCache)
gulp.task('compile-html', compileHTML)

function breakCache() {
  compileHTML()
}

function compileHTML() {
  return gulp.src('web/index.html')
    .pipe(cachebreaker('target/web'))
    .pipe(gulp.dest('target/web'))
}
