//gulp variables
var gulp = require('gulp'),
    replace = require('gulp-replace-task'),
    config = require('./config.json'),
    models = config.folders.production.models,
    classes = config.folders.production.classes;
//compile php
gulp.task('compile_php', ['database_php', 'copy_basic_php']);
//change variables in Database.php file
gulp.task('database_php', function(cb) {
  var mode = global.production_folder.substr(2);
  var params = config.app_params[mode];
  return gulp.src(config.php.database)
    .pipe(replace({
      patterns: [{
         match: /APP_DB_USERNAME/g,
         replacement: params.db_username
       },{
         match: /APP_DB_PASSWORD/g,
         replacement: params.db_password
      },{
         match: /APP_DB_NAME/g,
         replacement: params.db_name
      }]}))
    .pipe(gulp.dest(global.production_folder+classes));
});
//copy basic php files
gulp.task('copy_basic_php', function() {
  return gulp.src(config.php.basic).pipe(gulp.dest(global.production_folder+models));
});
