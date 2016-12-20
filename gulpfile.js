var gulp            = require("gulp");
var gulpif          = require("gulp-if");
var watch           = require("gulp-watch");
var concat          = require("gulp-concat");
var uglify          = require("gulp-uglify");
var plumber         = require("gulp-plumber");
var browserSync     = require("browser-sync");
var embedTemplates  = require("gulp-angular-embed-templates");
var angularFileSort = require("gulp-angular-filesort");

var paths = {
  js:       'src/js/**/*.js',
  dist:     'dist/',
  src:      'src/',
  dev:      'dev/'
};

function proccessJsTo (location) {
  return gulp.src(paths.js)
    .pipe(plumber())
    .pipe(angularFileSort())
    .pipe(concat("ng-geocoder.js"))
    .pipe(embedTemplates({
      "skipErrors": true
    }))
    .pipe(gulpif(location === "dist", uglify()))
    .pipe(gulp.dest(paths[location]));
}

gulp.task("jsDev", function () {
  return proccessJsTo("dev");
});

gulp.task("jsDist", function () {
  return proccessJsTo("dist");
});

gulp.task("watch", function () {
  watch(paths.js, function () {
    gulp.start("jsDev");
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

gulp.task("dev",   ["jsDev", "watch", "browser"]);
gulp.task("build", ["jsDist"]);
