//gulp variables
var gulp = require('gulp'),
    json_modify = require('gulp-json-modify'),
    runSequence = require('run-sequence'),
    del = require('del'),
    requireDir = require('require-dir')('./gulp_tasks'),
    config = require('./gulp_tasks/config.json'),
    folders=config.folders,
    webfonts=folders.production.webfonts;
//build app for development
gulp.task('default', function () {
  global.production_folder=folders.dev;
  gulp.start('build_app');
});
//function to build app for distribution
gulp.task('dist', function(callback) {
  global.production_folder=folders.dist;
  gulp.start('build_app');
});
/*
* BUILD APP
*/
//function to build app
gulp.task('build_app', function(callback) {
  runSequence(
    'build_clean',
    ['compile_php', 'compile_html', 'compile_styles', 'compile_js', 'optimize_images', 'change_manifest_starturl', 'copy_files'],
    'bundled_clean',
    callback);
});
//delete folders for production
gulp.task('build_clean', function() {
  var folders = [global.production_folder, './src/assets/js/bundled'];
  return del.sync(folders);
});
//delete bundled folder
gulp.task('bundled_clean', function() {
  return del.sync('./src/assets/js/bundled');
});
//copy ready files
gulp.task('copy_files', ['copy_fonts', 'copy_browserconfig']);
//copy web fonts
gulp.task('copy_fonts', function() {
  return gulp.src(config.fontawesome)
  .pipe(gulp.dest(global.production_folder+webfonts))
});
//copy browserconfig.xml
gulp.task('copy_browserconfig', function() {
  return gulp.src(config.browserconfig)
  .pipe(gulp.dest(global.production_folder))
});
//change start url in manifest
gulp.task('change_manifest_starturl', function () {
  var mode = global.production_folder.substr(2);
  var path = config.app_params[mode].path;
  var start_url = path+'index.html';
  return gulp.src([config.manifest])
    .pipe(json_modify({
      key: 'start_url',
      value: start_url
    }))
    .pipe(gulp.dest(global.production_folder));
});
