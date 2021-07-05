const { src, dest, parallel, series, watch } = require('gulp');

// Load plugins
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const browserSync = require('browser-sync').create();
const validator = require('gulp-html');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');

// const gulpCopy = require('gulp-copy');
// const otherGulpFunction = require('gulp-other-function');
const baseDir = './assets/';
const htmlDir = './';
const distDir = './';
const distDirHtml = './';
// Clean assets

// JS function
function js() {
  const source = baseDir + '/js/*.js';

  return src(source)
    .pipe(changed(source))
    .pipe(concat('bundle.js'))
    .pipe(babel())
    .pipe(
      rename({
        extname: '.min.js',
      })
    )
    .pipe(dest(distDir + '/dist/'))
    .pipe(browserSync.stream());
}

// CSS function
function css() {
  const source = baseDir + '/css/*.css';

  return src(source)
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(autoprefixer())
    .pipe(concat('styles.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(distDir + '/dist/'))
    .pipe(browserSync.stream());
}

function scss() {
  const source = baseDir + '/scss/**/*.scss';

  return src(source)
    .pipe(sourcemaps.init())
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(postcss())
    .pipe(concat('theme-onesiam.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(distDir + '/dist/'))
    .pipe(browserSync.stream());
}
// Optimize images
function img() {
  const source = baseDir + '/img/*/*/*';

  return src(source)
    .pipe(imagemin())
    .pipe(dest(distDir + '/img/'));
}

function html() {
  return (
    src(htmlDir + '*.html')
      // .pipe(validator())
      .pipe(dest(distDirHtml + '/'))
  );
}

// browserSync
const browserSyncWatch = () => {
  browserSync.init({
    server: './',
    port: 3336,
  });

  watch(baseDir + 'css/*.css', css);
  watch(baseDir + 'scss/**/*.scss', scss);
  watch(baseDir + 'js/*.js', js);
  watch(baseDir + 'img/*', img);
  // watch(htmlDir + "*.html", html);

  watch(htmlDir + '*.html').on('change', browserSync.reload);
};

// Tasks to define the execution of the functions simultaneously or in series
exports.html = html;
exports.styles = scss;
exports.js = js;
exports.watch = browserSyncWatch;
exports.default = series(html, img, js, css, scss);
