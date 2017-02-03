var gulp            = require("gulp");
var sass            = require("gulp-sass");
var guppy           = require("git-guppy");
var watch           = require("gulp-watch");
var gulpif          = require("gulp-if");
var concat          = require("gulp-concat");
var uglify          = require("gulp-uglify");
var cssNano         = require("gulp-cssnano");
var plumber         = require("gulp-plumber");
var browserSync     = require("browser-sync");
var includeFile     = require("gulp-include-file");
var autoprefixer    = require("gulp-autoprefixer");
var angularFileSort = require("gulp-angular-filesort");

var paths = {
  js:       'src/js/**/*.js',
  style:    'src/style/**/*.sass',
  dist:     'dist/',
  src:      'src/',
  dev:      'dev/'
};

var autoprefixerOptions = {
  browsers: [
      '> 1%',
      'last 2 versions',
      'firefox >= 4',
      'safari 7',
      'safari 8',
      'IE 8',
      'IE 9',
      'IE 10',
      'IE 11'
  ],
  cascade: false
};

function proccessJsTo (environment) {
  return gulp.src(paths.js)
    .pipe(plumber())
    .pipe(angularFileSort())
    .pipe(concat("ng-geocoder.js"))
    .pipe(includeFile())
    .pipe(gulpif(environment === "dist", uglify()))
    .pipe(gulp.dest(paths[environment]));
}

function proccessStyleTo (environment) {
  return gulp.src(paths.style)
    .pipe(plumber())
    .pipe(sass())
    .pipe(concat("ng-geocoder.css"))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulpif(environment === "dist", cssNano()))
    .pipe(gulp.dest(paths[environment]));
}

gulp.task("jsDev", function () {
  return proccessJsTo("dev");
});

gulp.task("jsDist", function () {
  return proccessJsTo("dist");
});

gulp.task("styleDev", function () {
  return proccessStyleTo("dev");
});

gulp.task("styleDist", function () {
  return proccessStyleTo("dist");
});

gulp.task("watch", function () {
  watch(paths.js, function () {
    gulp.start("jsDev");
  });

  watch(paths.style, function () {
    gulp.start("styleDev");
  });
});

gulp.task('browser', function () {
  browserSync.init(paths.dev, {
    port: '9000',
    server: {
      baseDir: paths.dev,
      routes: {
        "/bower": "bower_components"
      }
    },
    socket: {
      port: '9000',
      domain: 'localhost:9000'
    }
  });
});

gulp.task("dev",        ["jsDev", "styleDev", "watch", "browser"]);
gulp.task("build",      ["jsDist", "styleDist"]);
gulp.task("default",    ["dev"]);
gulp.task("pre-commit", ["build"]);