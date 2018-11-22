//gulp variables
var gulp = require('gulp'),
    minifyhtml = require('gulp-htmlmin'),
    htmlreplace = require('gulp-html-replace'),
    rename = require('gulp-rename'),
    through2 = require('through2'),
    config = require('./config.json'),
    pages = config.pages;
//function to help compile all html files through iteration
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
gulp.task('compile_html', function(done){
  var mode = global.production_folder.substr(2);
  var path = config.app_params[mode].path;
  var doneCounter = 0;
  function incDoneCounter() {
    doneCounter += 1;
    if (doneCounter >= pages.length) {
      done();
    }
  }
  for (var i = 0; i < pages.length; ++i) {
    page=pages[i];
    gulp.src(['./src/index.html'])
    .pipe(htmlreplace({
        js: {
          src: 'assets/js/app.min.js',
          tpl: '<script src="%s" type="application/javascript"></script>'
        },
        css: {
          src: 'assets/css/critical.min.css',
          tpl: '<link href="%s" rel="stylesheet" type="text/css">'
        },
        dns: {
          src: path,
          tpl: '<link href="%s" rel="dns-prefetch">'
        },
        preconnect: {
          src: path,
          tpl: '<link href="%s" rel="preconnect">'
        },
        base: {
          src: path,
          tpl: '<base href="%s">'
        },
        starturl: {
          src: path,
          tpl: '<meta name="msapplication-starturl" content="%s">'
        },
      }))
    .pipe(minifyhtml({collapseWhitespace: true, caseSensitive: true, removeComments: true}))
    .pipe(rename(page+".html"))
    .pipe(gulp.dest(global.production_folder))
    .pipe(synchro(incDoneCounter));
  }
});
