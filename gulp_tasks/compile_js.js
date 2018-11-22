//gulp variables
var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify-es').default,
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    replace = require('gulp-replace-task'),
    strip = require('gulp-strip-comments'),
    through2 = require('through2'),
    runSequence = require('run-sequence'),
    config = require('./config.json'),
    vanilla_js = config.vanilla_js,
    bundle_js = config.bundle_js,
    libs_js = config.libs_js,
    dest = config.folders.production.js;
//compile javascript
gulp.task('compile_js', function(callback) {
  runSequence(
    ['bundle_js', 'vanilla_js', 'service_worker'],
    ['add_home_libs',
      'add_profile_libs',
      'add_signup_libs',
      'add_addexpense_libs',
      'add_myexpenses_libs',
      'add_expensedetails_libs',
      'add_budgetgoals_libs'],
    callback);
});
//function to help compile all javascript files through iteration
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
gulp.task('vanilla_js', function(done){
  var mode = global.production_folder.substr(2);
  var path = config.app_params[mode].path;
  var app_scope = config.app_params[mode].app_scope;
  var filenames = Object.keys(vanilla_js);
  var doneCounter = 0;
  function incDoneCounter() {
    doneCounter += 1;
    if (doneCounter >= filenames.length) {
      done();
    }
  }
  for (var i = 0; i < filenames.length; ++i) {
    var filename = filenames[i];
    var files = vanilla_js[filename];
    var output_file=filename+".min.js";
    gulp.src(files)
      .pipe(sourcemaps.init())
      .pipe(babel({presets: ['es2015']}))
      .pipe(uglify())
      .pipe(concat(filename+'.min.js'))
      .pipe(sourcemaps.write())
      .pipe(strip())
      .pipe(replace({
        patterns: [{
           match: /APP_DOMAIN/g,
           replacement: path
         },{
           match: /APP_SCOPE/g,
           replacement: app_scope
        }]
      }))
      .pipe(gulp.dest(global.production_folder+dest))
      .pipe(synchro(incDoneCounter));
  }
});
//bundle scripts than require libs
gulp.task('bundle_js', function(done){
  var filenames = Object.keys(bundle_js);
  var doneCounter = 0;
  function incDoneCounter() {
    doneCounter += 1;
    if (doneCounter >= filenames.length) {
      done();
    }
  }
  for (var i = 0; i < filenames.length; ++i) {
    var filename = filenames[i];
    var files = bundle_js[filename];
    var output_file=filename+".min.js";
    gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify())
    .pipe(concat(filename+'.js'))
    .pipe(sourcemaps.write())
    .pipe(strip())
    .pipe(gulp.dest('./src/assets/js/bundled'))
    .pipe(synchro(incDoneCounter));
  }
});
//add libraries to home.js
gulp.task('add_home_libs', function() {
  var file = './src/assets/js/bundled/home.js';
  return gulp.src([libs_js.blobselect, libs_js.charts, file])
  .pipe(concat('home.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(global.production_folder+dest));
});
//add libraries to profile.js
gulp.task('add_profile_libs', function() {
  var file = './src/assets/js/bundled/profile.js';
  return gulp.src([libs_js.moment, libs_js.datepicker, file])
  .pipe(concat('profile.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(global.production_folder+dest));
});
//add libraries to signup.js
gulp.task('add_signup_libs', function() {
  var file = './src/assets/js/bundled/signup.js';
  return gulp.src([libs_js.moment, libs_js.datepicker, file])
  .pipe(concat('signup.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(global.production_folder+dest));
});
//add libraries to add_expense.js
gulp.task('add_addexpense_libs', function() {
  var file = './src/assets/js/bundled/add_expense.js';
  return gulp.src([libs_js.moment, libs_js.datepicker, libs_js.timepicker, libs_js.blobselect, file])
  .pipe(concat('add_expense.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(global.production_folder+dest));
});
//add libraries to my_expenses.js
gulp.task('add_myexpenses_libs', function() {
  var file = './src/assets/js/bundled/my_expenses.js';
  return gulp.src([libs_js.blobselect, file])
  .pipe(concat('my_expenses.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(global.production_folder+dest));
});
//add libraries to expense_details.js
gulp.task('add_expensedetails_libs', function() {
  var file = './src/assets/js/bundled/expense_details.js';
  return gulp.src([libs_js.blobselect, file])
  .pipe(concat('expense_details.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(global.production_folder+dest));
});
//add libraries to budget_and_goals.js
gulp.task('add_budgetgoals_libs', function() {
  var file = './src/assets/js/bundled/budget_and_goals.js';
  return gulp.src([libs_js.moment, libs_js.datepicker, libs_js.blobselect, file])
  .pipe(concat('budget_and_goals.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(global.production_folder+dest));
});
//transpile and minify servce worker
gulp.task('service_worker', () => {
  return gulp.src([config.service_worker])
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify())
    .pipe(gulp.dest(global.production_folder));
});
