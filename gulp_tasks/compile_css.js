//gulp variables
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    through2 = require('through2'),
    stripCssComments = require('gulp-strip-css-comments'),
    config = require('./config.json'),
    css = config.css,
    dest = config.folders.production.css;
//function to help compile all css files through iteration
function synchro(done) {
  return through2.obj(function (data, enc, cb) {
    cb();
  },
  function (cb) {
    cb();
    done();
  });
}
//function to compile styles
gulp.task('compile_styles', function(done){
  var filenames = Object.keys(css);
  var doneCounter = 0;
  function incDoneCounter() {
    doneCounter += 1;
    if (doneCounter >= filenames.length) {
      done();
    }
  }
  for (var i = 0; i < filenames.length; ++i) {
    var filename = filenames[i];
    var files = css[filename];
    var output_file=filename+".min.css";
    gulp.src(files)
      .pipe(stripCssComments({preserve: false}))
      .pipe(cleancss({debug: true, rebase: false}))
      .pipe(autoprefixer({browsers: ['last 99 versions'], cascade: false}))
      .pipe(concat(output_file))
      .pipe(gulp.dest(global.production_folder+dest))
      .pipe(synchro(incDoneCounter));
  }
});
