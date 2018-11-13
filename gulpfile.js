//gulp variables
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    cleancss = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    minifyhtml = require('gulp-htmlmin'),
    htmlreplace = require('gulp-html-replace'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    minify = require('gulp-minify'),
    uglify = require('gulp-uglify-es').default,
    through2 = require('through2'),
    json_modify = require('gulp-json-modify'),
    replace = require('gulp-replace-task');
//basic variables
var src = './src/',
    temp =  src+'temp',
    root_files =  src+'root_files',
    folder_img = src+'assets/images';
//javascript variables
var src_js = src+'assets/js',
    folder_transpiled_js = src_js+'/transpiled',
    folder_bundle_js = src_js+'/bundle';
//css variables
var folder_src_css = src+'assets/css',
    folder_optimized_css = src+'assets/css/optimized',
    folder_bundle_css = src+'assets/css/bundle',
    folder_fonts_css = folder_src_css+'/fonts';
//libs variables
var folder_libs = src+'assets/libs',
    fontawesome = folder_libs+'/fontawesome-free-5.2.0-web',
    charts = folder_libs+'/Chart.js/Chart.min.js',
    blobselect = folder_libs+'/blob-select-master/dist/blobselect.min.js',
    moment = folder_libs+'/md-date-time-picker-master/dist/js/moment.min.js',
    datepicker = folder_libs+'/md-date-time-picker-master/dist/js/mdDateTimePicker.min.js',
    timepicker = folder_libs+'/Timepicker-master/dist/grudus-timepicker.es5.js';
//variables for development and production
var production_folder = 'dev',
    clean_folder = 'dev',
    link = "http://localhost/budget_manager_ems_app/dev/",
    db_username = "root",
    db_password = "",
    db_name = "budgetmanager",
    app_scope = "/budget_manager_ems_app/dev/";
/*
* FUNCTION TO BUILD APP FOR DISTRIBUTION
*/
//function to build app
gulp.task('build_for_dist', function(callback) {
  production_folder="dist";
  clean_folder = production_folder;
  //variables that depend on the server where the app is uploaded
  link =`https://budgetmanager.codemix.gr/`;
  db_username = "codemixg_budget";
  db_password = "M@nS30w%mjQ,";
  db_name = "codemixg_budgetmanager";
  app_scope = "/budgetmanager.codemix.gr/";
  gulp.start('build_app');
});
/*
* BUILD APP
*/
//function to build app
gulp.task('build_app', function(callback) {
  runSequence(
    'build_clean',
    'prepare_files',
    'copy_files',
    'clean_source',
    callback);
});
/*
* DELETE FILES AND FOLDERS
*/
//function to clean source files that were created in order to help production
gulp.task('delete_folders', function() {
  return del.sync([
    folder_transpiled_js,
    folder_bundle_js,
    folder_optimized_css,
    folder_bundle_css,
    temp
  ]);
})
//delete prepared app.js file
gulp.task('delete_app_js', function(){
  return del([src_js+'/app.js']);
});
//clear root_files folder
gulp.task('clear_root_files', function() {
  return del([root_files+'/**/*', '!./src/root_files/browserconfig.xml']);
});
//clean source and return it to the original state
gulp.task('clean_source', function(callback) {
  runSequence(
    'delete_folders',
    'delete_app_js',
    'clear_root_files',
    callback);
});
//delete a folder
gulp.task('build_clean', function() {
  return del.sync(clean_folder);
});
/*
* FUNCTIONS TO COPY FILES
*/
//copy files
gulp.task('copy_files', function(callback) {
  runSequence(
    ['copy_php', 'copy_root_icons', 'copy_root_files', 'copy_fonts', 'copy_asset_icons', 'copy_css', 'copy_js'],
    callback);
});
//copy root files
gulp.task('copy_root_files', function() {
  return gulp.src([root_files+'/**/*']).pipe(gulp.dest(production_folder));
});
//copy css files
gulp.task('copy_css',function(){
  return gulp.src(folder_bundle_css+'/**.css')
  .pipe(cleancss({}))
  .pipe(gulp.dest(production_folder+'/assets/css'));
});
//copy js files
gulp.task('copy_js',function(){
  return gulp.src(folder_bundle_js+'/**.js')
  .pipe(gulp.dest(production_folder+'/assets/js'));
});
//copy web fonts
gulp.task('copy_fonts', function() {
  return gulp.src(fontawesome+'/webfonts/**/*')
  .pipe(gulp.dest(production_folder+'/assets/webfonts'))
});
/*
* FUNCTIONS TO PREPARE AND BUILD SCRIPTS
*/
//prepare files
gulp.task('prepare_files', function(callback) {
  runSequence(
    'prepare_app_js', 'minify_html',
    ['manifest_modify', 'prepare_sw', 'optimize_images', 'database_php', 'compile_html', 'build_scripts', 'build_styles'],
    callback);
});
//change variables in app.js
gulp.task('prepare_app_js', function(cb) {
  var file = src+'assets/js/_app/app.js';
  return gulp.src([file])
    .pipe(replace({
      patterns: [{
         match: /APP_DOMAIN/g,
         replacement: link
       },{
         match: /APP_SCOPE/g,
         replacement: app_scope
      }]
    }))
    .pipe(gulp.dest(src_js));
});
//modify start url in manifest
gulp.task('manifest_modify', function () {
  var jsonfile = src+'manifest.json';
  return gulp.src([jsonfile])
    .pipe(json_modify({
      key: 'start_url',
      value: link
    }))
    .pipe(gulp.dest(root_files));
});
//minify html
gulp.task('minify_html', function () {
  var htmlpage = src+'index.html';
  return gulp.src([htmlpage])
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
        src: link,
        tpl: '<link href="%s" rel="dns-prefetch">'
      },
      preconnect: {
        src: link,
        tpl: '<link href="%s" rel="preconnect">'
      },
      base: {
        src: link,
        tpl: '<base href="%s">'
      },
      starturl: {
        src: link,
        tpl: '<meta name="msapplication-starturl" content="%s">'
      },
    }))
  .pipe(minifyhtml({ collapseWhitespace: true }))
  .pipe(rename('index.html'))
  .pipe(gulp.dest(temp));
});
//function to help compile all html pages through iteration
function synchro(done) {
    return through2.obj(function (data, enc, cb) {
        cb();
    },
    function (cb) {
        cb();
        done();
    });
}
//compile html pages
gulp.task('compile_html', function (done) {
  var minified_html = temp+'/index.html';
  var pages = [
      "index",
      "account_activation",
      "add_expense",
      "budget_and_goals",
      "categories",
      "contact",
      "expense_details",
      "forgot_password",
      "my_expenses",
      "profile",
      "reset_password",
      "signup",
      "terms_of_use"
    ];
  var doneCounter = 0;
  function incDoneCounter() {
    doneCounter += 1;
    if (doneCounter >= pages.length) {
      done();
    }
  }
  for (var i = 0; i < pages.length; ++i) {
    page=pages[i];
    gulp.src([minified_html])
    .pipe(rename(page+".html"))
    .pipe(gulp.dest(root_files))
    .pipe(synchro(incDoneCounter));
  }
});
//transpile and minify servce worker
gulp.task('prepare_sw', () => {
  var sw = src+'ServiceWorker.js';
  return gulp.src([sw])
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(root_files));
});
/*
* IMAGES
*/
//optimize images
gulp.task('optimize_images', function(){
  return gulp.src(folder_img+'/**/*.+(png|jpg|jpeg|gif|svg|ico)')
  .pipe(imagemin(
    {
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{removeViewBox: true}]
    }
  ))
  .pipe(gulp.dest(temp));
});
//copy root icons
gulp.task('copy_root_icons', function(){
 return gulp.src(temp+'/root_img/**')
 .pipe(gulp.dest(production_folder));
});
//copy images for assets folder
gulp.task('copy_asset_icons', function(){
 return gulp.src(temp+'/img/**')
 .pipe(gulp.dest(production_folder+'/assets/img'));
});
/*
* PHP
*/
gulp.task('copy_php', function(callback) {
  runSequence(
    'copy_basic_php', 'copy_database_php', callback);
});
//change variables in Database.php file
gulp.task('database_php', function(cb) {
  var file = src+'models/_database/Database.php';
  return gulp.src([file])
    .pipe(replace({
      patterns: [{
         match: /APP_DB_USERNAME/g,
         replacement: db_username
       },{
         match: /APP_DB_PASSWORD/g,
         replacement: db_password
      },{
         match: /APP_DB_NAME/g,
         replacement: db_name
      }]
    }))
    .pipe(gulp.dest(temp));
});
//copy basic php files
gulp.task('copy_basic_php', function() {
  return gulp.src([
    'src/models/**/*',          //select all files
    '!src/models/**/_*/',       //exclude folders starting with '_'
    '!src/models/**/_*/**/*',   //exclude files/subfolders in folders starting with '_'
    ])
    .pipe(gulp.dest(production_folder+'/models'));
});
//copy database php file
gulp.task('copy_database_php', function() {
  return gulp.src([
    temp+'/Database.php',
    ])
    .pipe(gulp.dest(production_folder+'/models/classes'));
});
/*
* BUILD STYLES
*/
//build appropriately css for the app
gulp.task('build_styles', function(callback) {
  runSequence(
  'optimize_styles',
  'move_css',
  'signin_css',
  'signup_css',
  'passforgot_css',
  'passreset_css',
  'terms_css',
  'contact_css',
  'home_css',
  'categories_css',
  'profile_css',
  'add_expense_css',
  'my_expenses_css',
  'expense_details_css',
  'budgetgoals_css',
  'critical_css',
   callback);
});
//function to optimize styles
gulp.task('optimize_styles', function(){
  return  gulp.src(folder_src_css+'/**.css')
    .pipe(cleancss({}))
    .pipe(autoprefixer({
        browsers: ['last 99 versions'],
        cascade: false
    }))
    .pipe(gulp.dest(folder_optimized_css));
  });
//move ready css
gulp.task('move_css',function(){
  return gulp.src([
    folder_optimized_css+'/account_activation.css'
  ])
  .pipe(cleancss({}))
  .pipe(concat('account_activation.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for app
gulp.task('critical_css',function(){
  return gulp.src([
  fontawesome+'/css/all.min.css',
  folder_libs+'/appfont.css',
  folder_optimized_css+'/critical.css'
  ])
  .pipe(cleancss({}))
  .pipe(concat('critical.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for sign in page
gulp.task('signin_css',function(){
  return gulp.src([
    folder_optimized_css+'/form.css',
    folder_optimized_css+'/signin.css'])
  .pipe(concat('signin.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for home page
gulp.task('home_css',function(){
  return gulp.src([
  folder_optimized_css+'/blobselect.css',
  folder_optimized_css+'/loggeduser.css',
  folder_optimized_css+'/menu.css',
  folder_optimized_css+'/home.css'
  ])
  .pipe(cleancss({}))
  .pipe(concat('home.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for forgot password page
gulp.task('passforgot_css',function(){
  return gulp.src([
    folder_optimized_css+'/form.css',
    folder_optimized_css+'/forgot_password.css'])
  .pipe(cleancss({}))
  .pipe(concat('forgot_password.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for reset password page
gulp.task('passreset_css',function(){
  return gulp.src([folder_optimized_css+'/form.css',folder_optimized_css+'/reset_password.css'])
  .pipe(cleancss({}))
  .pipe(concat('reset_password.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css forterms page
gulp.task('terms_css',function(){
  return gulp.src([folder_optimized_css+'/menu.css',folder_optimized_css+'/terms_of_use.css'])
  .pipe(cleancss({}))
  .pipe(concat('terms_of_use.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for contact page
gulp.task('contact_css',function(){
  return gulp.src([folder_optimized_css+'/menu.css', folder_optimized_css+'/form.css', folder_optimized_css+'/contact.css'])
  .pipe(cleancss({}))
  .pipe(concat('contact.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for signup page
gulp.task('signup_css',function(){
  return gulp.src([folder_optimized_css+'/form.css',folder_optimized_css+'/datepicker.css', folder_optimized_css+'/signup.css'])
  .pipe(cleancss({}))
  .pipe(concat('signup.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for categories page
gulp.task('categories_css',function(){
  return gulp.src([folder_optimized_css+'/loggeduser.css', folder_optimized_css+'/menu.css', folder_optimized_css+'/form.css', folder_optimized_css+'/categories.css'])
  .pipe(cleancss({}))
  .pipe(concat('categories.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for profile page
gulp.task('profile_css',function(){
  return gulp.src([folder_optimized_css+'/menu.css', folder_optimized_css+'/datepicker.css', folder_optimized_css+'/form.css', folder_optimized_css+'/profile.css'])
  .pipe(cleancss({}))
  .pipe(concat('profile.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for add expense page
gulp.task('add_expense_css',function(){
  return gulp.src([
    folder_optimized_css+'/timepicker.css',
    folder_optimized_css+'/datepicker.css',
    folder_optimized_css+'/blobselect.css',
    folder_optimized_css+'/loggeduser.css',
    folder_optimized_css+'/menu.css',
    folder_optimized_css+'/form.css',
    folder_optimized_css+'/add_expense.css'
  ])
  .pipe(cleancss({}))
  .pipe(concat('add_expense.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for my expenses page
gulp.task('my_expenses_css',function(){
  return gulp.src([folder_optimized_css+'/blobselect.css', folder_optimized_css+'/loggeduser.css', folder_optimized_css+'/menu.css', folder_optimized_css+'/my_expenses.css'])
  .pipe(cleancss({}))
  .pipe(concat('my_expenses.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for expense details page
gulp.task('expense_details_css',function(){
  return gulp.src([
  folder_optimized_css+'/blobselect.css',
  folder_optimized_css+'/timepicker.css',
  folder_optimized_css+'/datepicker.css',
  folder_optimized_css+'/form.css',
  folder_optimized_css+'/loggeduser.css',
  folder_optimized_css+'/menu.css',
  folder_optimized_css+'/expense_details.css'
  ])
  .pipe(cleancss({}))
  .pipe(concat('expense_details.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
//create css for budget and goals page
gulp.task('budgetgoals_css',function(){
  return gulp.src([
    folder_optimized_css+'/blobselect.css',
    folder_optimized_css+'/datepicker.css',
    folder_optimized_css+'/form.css',
    folder_optimized_css+'/loggeduser.css',
    folder_optimized_css+'/menu.css',
    folder_optimized_css+'/budget_and_goals.css'
  ])
  .pipe(cleancss({}))
  .pipe(concat('budget_and_goals.min.css'))
  .pipe(gulp.dest(folder_bundle_css));
});
/*
* BUILD JAVASCRIPT FILES
*/
//build appropriately javascript for the app
gulp.task('build_scripts', function(callback) {
  runSequence(
  'js_transp',
  'move_scripts',
  'app_scripts',
  'home_scripts',
  'profile_scripts',
  'my_expenses_scripts',
  'add_expense_scripts',
  'expense_details_scripts',
  'budget_goals_scripts',
  'signup_scripts',
   callback);
});
//transpile and minify source js files
gulp.task('js_transp', () => {
  return gulp.src(src_js+'/**.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest(folder_transpiled_js));
});
//move ready scripts
gulp.task('move_scripts',function(){
  return gulp.src([
    folder_transpiled_js+'/account_activation.js',
    folder_transpiled_js+'/categories.js',
    folder_transpiled_js+'/forgot_password.js',
    folder_transpiled_js+'/reset_password.js',
    folder_transpiled_js+'/contact.js',
    folder_transpiled_js+'/signin.js',
  ])
  .pipe(minify({
        ext:{
            min:'.min.js'
        },
        noSource: true}))
    .pipe(gulp.dest(folder_bundle_js));
});
//create bundle js of the app
gulp.task('app_scripts', function () {
	gulp.src([
  folder_transpiled_js+'/app.js',
  folder_transpiled_js+'/utilities.js',
  folder_transpiled_js+'/data_handler.js',
  folder_transpiled_js+'/element_creator.js'
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('app.min.js'))
  .pipe(minify({
    ext:{
      min:'.js'
    },
    noSource: true}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(folder_bundle_js));
});
//create bundle js of home page
gulp.task('home_scripts', function() {
  return gulp.src([blobselect, charts, folder_transpiled_js+'/home.js'])
  .pipe(concat('home.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(folder_bundle_js));
});
//create bundle js of profile page
gulp.task('profile_scripts', function() {
  return gulp.src([moment,datepicker,folder_transpiled_js+'/profile.js'
  ])
  .pipe(concat('profile.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(folder_bundle_js));
});
//create bundle js of my expenses page
gulp.task('my_expenses_scripts', function() {
  return gulp.src([blobselect, folder_transpiled_js+'/my_expenses.js'])
  .pipe(concat('my_expenses.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(folder_bundle_js));
});
//create bundle js of add expense page
gulp.task('add_expense_scripts', function() {
  return gulp.src([moment, datepicker, timepicker, blobselect, folder_transpiled_js+'/add_expense.js'])
  .pipe(concat('add_expense.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(folder_bundle_js));
});
//create bundle js of expense details page
gulp.task('expense_details_scripts', function() {
  return gulp.src([moment, datepicker, timepicker, blobselect, folder_transpiled_js+'/expense_details.js'])
  .pipe(concat('expense_details.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(folder_bundle_js));
});
//create bundle js of budget and goals page
gulp.task('budget_goals_scripts', function() {
  return gulp.src([moment, datepicker, blobselect, folder_transpiled_js+'/budget_and_goals.js'])
  .pipe(concat('budget_and_goals.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(folder_bundle_js));
});
//create bundle js of sign up page
gulp.task('signup_scripts', function() {
  return gulp.src([moment, datepicker, folder_transpiled_js+'/signup.js'])
  .pipe(concat('signup.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(folder_bundle_js));
});






//
