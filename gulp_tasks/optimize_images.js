//gulp variables
var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    config = require('./config.json'),
    images = config.images,
    img = config.folders.production.img;
//optimize all images
gulp.task('optimize_images', ['optimize_root_images', 'optimize_img_assets']);
//optimize root images
gulp.task('optimize_root_images', function() {
  return gulp.src(images.root)
  .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{removeViewBox: true}]}))
  .pipe(gulp.dest(global.production_folder));
});
//optimize images
gulp.task('optimize_img_assets', function(){
  return gulp.src(images.assets)
  .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{removeViewBox: true}]}))
  .pipe(gulp.dest(global.production_folder+img));
});
